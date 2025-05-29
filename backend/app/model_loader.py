import os
import joblib
import tensorflow as tf
import xgboost as xgb

# Load and return the encoder, XGBoost model, and preprocessing objects
def load_models(models_dir: str = None):
    if models_dir is None:
        models_dir = os.getenv("MODELS_DIR", "./models")

    # Load encoder part of your autoencoder
    encoder = tf.keras.models.load_model(os.path.join(models_dir, "encoder.h5"), compile=False)

    # Load XGBoost booster
    xgb_model = xgb.Booster()
    xgb_model.load_model(os.path.join(models_dir, "xgb_model.json"))

    # Load preprocessing pipeline
    imputer    = joblib.load(os.path.join(models_dir, "imputer.joblib"))
    scaler     = joblib.load(os.path.join(models_dir, "scaler.joblib"))
    feat_cols  = joblib.load(os.path.join(models_dir, "feature_cols.joblib"))

    return encoder, xgb_model, imputer, scaler, feat_cols


def preprocess(df, feat_cols, imputer, scaler, encoder):
    """
    1. Select columns
    2. Impute missing values
    3. Scale features
    4. Encode via autoencoder's encoder
    """
    X = df[feat_cols].copy()
    X_imp    = imputer.transform(X)
    X_scaled = scaler.transform(X_imp)
    encoded  = encoder.predict(X_scaled)
    return encoded
