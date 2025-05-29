# import os
# from pathlib import Path
# from dotenv import load_dotenv
# import firebase_admin
# from firebase_admin import credentials, firestore

# # -----------------------------------------------------------------------------
# # 1. Load .env from the backend folder (project root)
# # -----------------------------------------------------------------------------
# # Assume this file lives in backend/app/firebase_client.py
# PROJECT_ROOT = Path(__file__).resolve().parent.parent
# env_path = PROJECT_ROOT / ".env"
# if env_path.exists():
#     load_dotenv(env_path)
# else:
#     print(f"⚠️  No .env file found at {env_path}, proceeding with system env vars")

# # -----------------------------------------------------------------------------
# # 2. Determine credential path
# # -----------------------------------------------------------------------------
# cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
# if cred_path:
#     cred_path = Path(cred_path)
# else:
#     cred_path = PROJECT_ROOT / "serviceAccountKey.json"

# if not cred_path.exists():
#     raise FileNotFoundError(
#         f"Firebase credential file not found. "
#         f"Checked GOOGLE_APPLICATION_CREDENTIALS and fallback, but no file at: {cred_path}"
#     )

# # -----------------------------------------------------------------------------
# # 3. Initialize Firebase App once
# # -----------------------------------------------------------------------------
# if not firebase_admin._apps:
#     cred = credentials.Certificate(str(cred_path))
#     firebase_admin.initialize_app(cred)

# # -----------------------------------------------------------------------------
# # 4. Firestore client
# # -----------------------------------------------------------------------------
# db = firestore.client()

# def log_prediction(record: dict):
#     """
#     Adds a server timestamp and writes the record to the 'predictions' collection.
#     """
#     record["timestamp"] = firestore.SERVER_TIMESTAMP
#     _, record_doc_ref = db.collection("predictions").add(record)
#     print(record_doc_ref.id)

#     return record_doc_ref.id





import os
from firebase_admin import credentials, firestore, initialize_app

# Path to service account key JSON; override via env var if needed
cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "serviceAccountKey.json")
cred = credentials.Certificate(cred_path)
initialize_app(cred)

# Firestore client
db = firestore.client()

def log_prediction(record: dict):
    """
    Append a prediction record to Firestore in collection 'predictions'.
    """
    record["timestamp"] = firestore.SERVER_TIMESTAMP
    _, record_doc_ref = db.collection("predictions").add(record)
    print(record_doc_ref.id)

    return record_doc_ref.id
