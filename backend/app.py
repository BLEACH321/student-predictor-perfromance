from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Cloud Configuration
MAKE_WEBHOOK_URL = os.environ.get("MAKE_WEBHOOK_URL")

# --- MOCK ML LOGIC ---
def predict_performance(data):
    study_hours = data.get('studyHours', 0)
    attendance = data.get('attendance', 0)
    assignments = data.get('assignmentScore', 0)
    prev_marks = data.get('previousMarks', 0)
    
    # Simple linear model approximation
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
            "analysis": "AI Cloud synthesis suggests a professional-grade trajectory."
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/store', methods=['POST'])
def store():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Cloud Storage via Make.com
        if not MAKE_WEBHOOK_URL:
            return jsonify({"status": "error", "message": "Cloud Database (Make.com) not configured"}), 503

        try:
            make_data = {
                "action": "store_record",
                "id": str(datetime.utcnow().timestamp()),
                "name": data.get('name'),
                "grade": data.get('grade'),
                "studyHours": data.get('studyHours'),
                "attendance": data.get('attendance'),
                "assignmentScore": data.get('assignmentScore'),
                "previousMarks": data.get('previousMarks'),
                "predictedMarks": data.get('predictedMarks'),
                "createdAt": datetime.utcnow().isoformat()
            }
            # Sending to Make.com Webhook
            response = requests.post(MAKE_WEBHOOK_URL, json=make_data, timeout=5)
            print(f"Make.com Cloud Sync Response: {response.status_code}")
            
            return jsonify({
                "status": "success",
                "message": "Record synced to Make.com Cloud Database",
                "cloud_response": response.status_code
            })
        except Exception as me:
            print(f"Make.com Sync failed: {me}")
            return jsonify({"status": "error", "message": f"Cloud Sync Failure: {str(me)}"}), 500

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/students', methods=['GET'])
def get_students():
    # Fetching from Make.com (Assuming the webhook supports a 'fetch' action)
    if not MAKE_WEBHOOK_URL:
        return jsonify([])
        
    try:
        # Note: Some Make webhooks only accept POST. 
        # App.tsx is already set up to send {action: 'fetch_students'} via POST.
        # But if the browser calls /students (GET), our Flask backend can act as a bridge:
        res = requests.post(MAKE_WEBHOOK_URL, json={"action": "fetch_students"}, timeout=5)
        if res.status_code == 200:
            return jsonify(res.json())
    except Exception as e:
        print(f"Failed to fetch from Make.com: {e}")
        
    return jsonify([])

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy", 
        "database": "Make.com Cloud Integrated",
        "webhook_configured": bool(MAKE_WEBHOOK_URL)
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    # Run server
    app.run(host='0.0.0.0', port=port)
