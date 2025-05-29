# File: model.py

import os
import re
import glob
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve
)
import xgboost as xgb
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
from tensorflow.keras.optimizers import Adam
import joblib

# -------------------------------------------------------------------
# 1. LOAD & LABEL TRAINING DATA (multi-class)
# -------------------------------------------------------------------
dataset_dir = r"C:/Users/Lenovo/Desktop/sem 3/innovation/TIRP PROJECT/datasets"
pattern     = os.path.join(dataset_dir, "*_Cat.csv")
files       = glob.glob(pattern)

dfs = []
for fp in files:
    basename = os.path.basename(fp)
    # remove suffix like _after_reboot_Cat or _before_reboot_Cat
    name = re.sub(r"_(?:after|before)_.*?_Cat\.csv$", "", basename)
    df_tmp = pd.read_csv(fp, na_values=["?"], low_memory=False)
    df_tmp['class'] = name
    dfs.append(df_tmp)

df = pd.concat(dfs, ignore_index=True)
print(f"✔️ Loaded {len(files)} files, total samples: {len(df)}")

# encode class labels to integers
label_enc = LabelEncoder()
y_num     = label_enc.fit_transform(df['class'])

# one-hot encode if you need it elsewhere
onehot = OneHotEncoder(sparse_output=False, dtype=int)
y_ohe  = onehot.fit_transform(y_num.reshape(-1, 1))

# save encoders
os.makedirs('models', exist_ok=True)
joblib.dump(label_enc, 'models/label_encoder.joblib')
joblib.dump(onehot,     'models/onehot_encoder.joblib')

# -------------------------------------------------------------------
# 2. FEATURES & TARGET for training
# -------------------------------------------------------------------
X = df.drop(columns=['class'])
y = y_num  # use integer labels

# -------------------------------------------------------------------
# 3. CLEAN & IMPUTE
# -------------------------------------------------------------------
X = X.apply(pd.to_numeric, errors='coerce')
imputer = SimpleImputer(strategy='median')
X_imp   = imputer.fit_transform(X)

# -------------------------------------------------------------------
# 4. SCALE
# -------------------------------------------------------------------
scaler   = StandardScaler()
X_scaled = scaler.fit_transform(X_imp)

# -------------------------------------------------------------------
# 5. SPLIT TRAIN/VALIDATION
# -------------------------------------------------------------------
X_trainval, X_holdout, y_trainval, y_holdout = train_test_split(
    X_scaled, y, test_size=0.20, stratify=y, random_state=42
)
X_train, X_val, y_train, y_val = train_test_split(
    X_trainval, y_trainval, test_size=0.25, stratify=y_trainval, random_state=42
)

# -------------------------------------------------------------------
# 6. AUTOENCODER TRAINING
# -------------------------------------------------------------------
input_dim    = X_train.shape[1]
encoding_dim = 32

inp = Input(shape=(input_dim,))
enc = Dense(encoding_dim, activation='relu')(inp)
dec = Dense(input_dim,    activation='sigmoid')(enc)

autoencoder = Model(inputs=inp, outputs=dec)
autoencoder.compile(optimizer=Adam(1e-3), loss='mse')

autoencoder.fit(
    X_train, X_train,
    epochs=50,
    batch_size=128,
    shuffle=True,
    validation_data=(X_val, X_val),
    verbose=1
)

# extract the encoder model
encoder = Model(inputs=inp, outputs=enc)
X_train_enc   = encoder.predict(X_train)
X_holdout_enc = encoder.predict(X_holdout)

# -------------------------------------------------------------------
# 7. XGBOOST CLASSIFIER TRAINING (multi-class)
# -------------------------------------------------------------------
xgb_clf = xgb.XGBClassifier(
    objective='multi:softprob',
    num_class=len(label_enc.classes_),
    use_label_encoder=False,
    eval_metric='mlogloss',
    random_state=42,
    n_estimators=100
)
xgb_clf.fit(X_train_enc, y_train)

# -------------------------------------------------------------------
# 8. EVALUATION ON HOLDOUT SET
# -------------------------------------------------------------------
y_pred  = xgb_clf.predict(X_holdout_enc)
y_proba = xgb_clf.predict_proba(X_holdout_enc)

acc = accuracy_score(y_holdout, y_pred)
print(f"Holdout Accuracy: {acc:.4f}\n")
print(classification_report(y_holdout, y_pred, target_names=label_enc.classes_))

cm = confusion_matrix(y_holdout, y_pred)
plt.figure()
plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('True')
plt.colorbar()
plt.show()

for i, cls in enumerate(label_enc.classes_):
    fpr, tpr, _ = roc_curve(y_holdout == i, y_proba[:, i])
    auc_score   = roc_auc_score(y_holdout == i, y_proba[:, i])
    plt.plot(fpr, tpr, label=f"{cls} AUC={auc_score:.2f}")
plt.plot([0,1],[0,1],'--',color='gray')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Multi-class ROC Curves')
plt.legend()
plt.show()

# -------------------------------------------------------------------
# 9. SAVE ALL ARTIFACTS
# -------------------------------------------------------------------
autoencoder.save('models/autoencoder.h5')
encoder.save('models/encoder.h5')
joblib.dump(imputer, 'models/imputer.joblib')
joblib.dump(scaler,   'models/scaler.joblib')
xgb_clf.save_model('models/xgb_model.json')

print("✔️ Saved autoencoder, encoder, imputer, scaler, xgb_model, and encoders to 'models/'")
