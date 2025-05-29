# src/app/main.py

import traceback
import numpy as np
import pandas as pd
import joblib
import xgboost as xgb
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model

from .model_loader import preprocess
from .schemas import BulkPredictionResponse, Prediction
from .firebase_client import log_prediction

# ─── paths & load artifacts ───────────────────────────────────────────────────
BASE_DIR   = Path(__file__).resolve().parent
MODEL_DIR  = BASE_DIR.parent / "models"

# load your encoder (from the autoencoder)
encoder = load_model(str(MODEL_DIR / "encoder.h5"), compile=False)

# load XGBoost multi-class booster
xgb_model = xgb.Booster()
xgb_model.load_model(str(MODEL_DIR / "xgb_model.json"))

# load preprocessors and label encoder
imputer       = joblib.load(MODEL_DIR / "imputer.joblib")
scaler        = joblib.load(MODEL_DIR / "scaler.joblib")
feat_cols     = joblib.load(MODEL_DIR / "feature_cols.joblib")
label_encoder = joblib.load(MODEL_DIR / "label_encoder.joblib")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict/csv", response_model=BulkPredictionResponse)
async def predict_csv(file: UploadFile = File(...)):
    try:
        # 1) read CSV
        df = pd.read_csv(file.file)

        # 2) preprocess features including encoding
        #    signature: preprocess(df, feat_cols, imputer, scaler, encoder)
        X_features = preprocess(df, feat_cols, imputer, scaler, encoder)

        # 3) convert to raw numpy array so Booster skips feature-name checks
        raw_features = X_features.values if hasattr(X_features, "values") else np.array(X_features)
        dmat = xgb.DMatrix(raw_features)

        # 4) run XGBoost multi-class prediction
        probs = xgb_model.predict(dmat)
        if probs.ndim == 1:
            # fallback for binary models
            probs = np.vstack([1 - probs, probs]).T

        # 5) build results
        pred_idx   = np.argmax(probs, axis=1)
        pred_label = label_encoder.inverse_transform(pred_idx)
        pred_score = [float(probs[i, pred_idx[i]]) for i in range(len(pred_idx))]

        results = []
        for record, marl, scr in zip(df.to_dict(orient="records"), pred_label, pred_score):
            results.append(
                Prediction(
                    source     = record.get("source", ""),
                    true_label = int(record.get("true_label", -1)),
                    predicted  = marl,
                    score      = scr,
                )
            )
            log_prediction({**record, "predicted": marl, "score": scr})

        return BulkPredictionResponse(results=results)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
