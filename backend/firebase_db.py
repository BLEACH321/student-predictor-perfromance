import firebase_admin
from firebase_admin import credentials, firestore
import os

# Use the provided key in the backend folder
cred_path = 'backend/serviceAccountKey.json' if os.path.exists('backend/serviceAccountKey.json') else os.environ.get("FIREBASE_SERVICE_ACCOUNT")
if cred_path and os.path.exists(cred_path):
    print(f"Connecting to Firebase Firestore using {cred_path}...")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Successfully connected to Firebase Firestore!")
else:
    db = None
    print(f"WARNING: Firebase Credentials not found at {cred_path}. Cloud Firestore disabled.")

def store_student_record(data):
    if not db: return None
    doc_ref = db.collection('student_records').document()
    doc_ref.set(data)
    return doc_ref.id

def get_all_student_records():
    if not db: return []
    docs = db.collection('student_records').order_by('createdAt', direction=firestore.Query.DESCENDING).stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs]
