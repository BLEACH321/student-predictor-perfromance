from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for the React frontend

# Supabase Setup (Optional Persistence)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None
    print("WARNING: Supabase credentials not found. /store endpoint will not persist data.")

# --- MOCK ML LOGIC (Senior ML Architect approach) ---
def predict_performance(data):
    """
    Simulates an ML model prediction using weighted regression.
    In a real scenario, you'd load a .joblib or .pkl model here.
    """
    study_hours = data.get('studyHours', 0)
    attendance = data.get('attendance', 0)
    assignments = data.get('assignmentScore', 0)
    prev_marks = data.get('previousMarks', 0)
    
    # Simple weighted baseline
    # (study_hours normalized to 40h)
    norm_study = min((study_hours / 40) * 100, 100)
    
    weights = {
        'study': 0.25,
        'attendance': 0.25,
        'assignments': 0.30,
        'previous': 0.20
    }
    
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
            "analysis": "AI synthesis suggests a strong trajectory based on engagement metrics."
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/store', methods=['POST'])
def store():
    if not supabase:
        return jsonify({"error": "Supabase not configured"}), 503
        
    try:
        data = request.json
        # Store in 'student_records' table
        response = supabase.table('student_records').insert(data).execute()
        
        return jsonify({
            "status": "success",
            "message": "Record persisted to cloud database",
            "id": response.data[0]['id'] if response.data else "N/A"
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "Student Performance AI Predictor"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
