# prediction_model.py

import pandas as pd
import joblib
import xgboost as xgb
from tensorflow.keras.models import load_model, Model
from sklearn.metrics import accuracy_score

def main():
    # 1. Load test data
    df_test = pd.read_csv('test.csv')
    
    # Determine if we have ground-truth labels
    has_labels = 'class' in df_test.columns
    if has_labels:
        true_labels = df_test['class'].astype(str).values
        X_test = df_test.drop(columns=['class']).apply(pd.to_numeric, errors='coerce')
    else:
        print("⚠️  No 'class' column found in test.csv — skipping accuracy calculation.")
        X_test = df_test.apply(pd.to_numeric, errors='coerce')
    
    # 2. Preprocessing
    imputer = joblib.load('models/imputer.joblib')
    scaler  = joblib.load('models/scaler.joblib')
    X_imp    = imputer.transform(X_test)
    X_scaled = scaler.transform(X_imp)
    
    # 3. Encode via autoencoder
    autoencoder = load_model('models/autoencoder.h5', compile=False)
    encoder     = Model(inputs=autoencoder.input,
                        outputs=autoencoder.layers[1].output)
    X_enc       = encoder.predict(X_scaled)
    
    # 4. Classify with XGBoost
    clf       = xgb.XGBClassifier()
    clf.load_model('models/xgb_model.json')
    proba     = clf.predict_proba(X_enc)
    pred_idx  = proba.argmax(axis=1)
    
    # 5. Decode labels
    label_enc   = joblib.load('models/label_encoder.joblib')
    pred_labels = label_enc.inverse_transform(pred_idx)
    
    # 6. If possible, compute and print accuracy
    if has_labels:
        acc = accuracy_score(true_labels, pred_labels)
        print(f"Accuracy: {acc:.4f}")
    
    # 7. Summary of counts
    s = pd.Series(pred_labels, name='predicted_label')
    counts = s.value_counts()
    
    print(f"Total samples: {len(s)}\n")
    print("Malware counts by class:")
    for cls, cnt in counts.items():
        print(f" - {cls}: {cnt}")

if __name__ == '__main__':
    main()
