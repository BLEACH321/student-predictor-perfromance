from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
from dotenv import load_dotenv
import firebase_db  # Import our new firebase module

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Setup
DATABASE_URL = os.environ.get("DATABASE_URL")
engine = None
SessionManual = None

try:
    if DATABASE_URL:
        print(f"Connecting to Neon PostgreSQL...")
        engine = create_engine(DATABASE_URL, connect_args={'connect_timeout': 5})
        # Test connection
        conn = engine.connect()
        conn.close()
        print("Successfully connected to Neon PostgreSQL!")
    else:
        raise Exception("DATABASE_URL not found")
except Exception as e:
    print(f"Neon connection failed: {e}. Falling back to local SQLite.")
    engine = create_engine('sqlite:///students.db')

SessionManual = sessionmaker(bind=engine)
Base = declarative_base()

class StudentRecord(Base):
    __tablename__ = 'student_records'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    grade = Column(String)
    study_hours = Column(Integer)
    attendance = Column(Integer)
    assignment_score = Column(Integer)
    previous_marks = Column(Integer)
    predicted_marks = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables in the database if they don't exist
Base.metadata.create_all(engine)

# --- MOCK ML LOGIC ---
def predict_performance(data):
    study_hours = data.get('studyHours', 0)
    attendance = data.get('attendance', 0)
    assignments = data.get('assignmentScore', 0)
    prev_marks = data.get('previousMarks', 0)
    
    norm_study = min((study_hours / 40) * 100, 100)
    
    weights = {'study': 0.25, 'attendance': 0.25, 'assignments': 0.30, 'previous': 0.20}
    prediction = (norm_study * weights['study'] + 
                  attendance * weights['attendance'] + 
                  assignments * weights['assignments'] + 
                  prev_marks * weights['previous'])
    
    return round(prediction, 2)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        prediction = predict_performance(data)
        return jsonify({
            "status": "success",
            "predictedMarks": prediction,
            "analysis": "AI synthesis suggests a high-potential trajectory."
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/store', methods=['POST'])
def store():
    if not engine:
        return jsonify({"error": "Neon Database not configured"}), 503
        
    try:
        data = request.json
        session = SessionManual()
        new_record = StudentRecord(
            name=data.get('name'),
            grade=data.get('grade'),
            study_hours=data.get('studyHours'),
            attendance=data.get('attendance'),
            assignment_score=data.get('assignmentScore'),
            previous_marks=data.get('previousMarks'),
            predicted_marks=data.get('predictedMarks')
        )
        session.add(new_record)
        session.commit()
        record_id = new_record.id
        session.close()
        
        # 2. ALSO Store in Firebase Firestore (Dual Sync)
        try:
            firebase_data = {
                "name": data.get('name'),
                "grade": data.get('grade'),
                "studyHours": data.get('studyHours'),
                "attendance": data.get('attendance'),
                "assignmentScore": data.get('assignmentScore'),
                "previousMarks": data.get('previousMarks'),
                "predictedMarks": data.get('predictedMarks'),
                "createdAt": datetime.utcnow().isoformat()
            }
            firebase_id = firebase_db.store_student_record(firebase_data)
            print(f"Record also saved to Firebase with ID: {firebase_id}")
        except Exception as fe:
            print(f"Firebase Sync failed: {fe}")

        return jsonify({
            "status": "success",
            "message": "Record persisted to Cloud Databases",
            "id": record_id
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/students', methods=['GET'])
def get_students():
    result = []
    
    # 1. Try fetching from Firebase first (Fastest/Cloud Primary)
    try:
        firebase_records = firebase_db.get_all_student_records()
        if firebase_records:
            return jsonify(firebase_records)
    except Exception as fe:
        print(f"Firestore fetch failed: {fe}. Falling back to SQL.")

    # 2. Fallback to SQL Database
    if not engine:
        return jsonify([])
    try:
        session = SessionManual()
        records = session.query(StudentRecord).order_by(StudentRecord.created_at.desc()).all()
        for r in records:
            result.append({
                "id": str(r.id),
                "name": r.name,
                "grade": r.grade,
                "studyHours": r.study_hours,
                "attendance": r.attendance,
                "assignmentScore": r.assignment_score,
                "previousMarks": r.previous_marks,
                "predictedMarks": r.predicted_marks,
                "createdAt": r.created_at.isoformat()
            })
        session.close()
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "Neon Optimized Predictor API"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
