import pandas as pd
import os
from datetime import datetime

EXCEL_FILE = 'students.xlsx'

def init_db():
    if not os.path.exists(EXCEL_FILE):
        df = pd.DataFrame(columns=[
            'id', 'name', 'grade', 'studyHours', 'attendance', 
            'assignmentScore', 'previousMarks', 'predictedMarks', 'createdAt'
        ])
        df.to_excel(EXCEL_FILE, index=False)
        print(f"Created new Excel database: {EXCEL_FILE}")

def store_student_record(data):
    init_db()
    try:
        df = pd.read_excel(EXCEL_FILE)
        # Generate a simple incremental ID if not provided
        new_id = str(len(df) + 1)
        
        new_row = {
            'id': data.get('id', new_id),
            'name': data.get('name'),
            'grade': data.get('grade'),
            'studyHours': data.get('studyHours'),
            'attendance': data.get('attendance'),
            'assignmentScore': data.get('assignmentScore'),
            'previousMarks': data.get('previousMarks'),
            'predictedMarks': data.get('predictedMarks'),
            'createdAt': data.get('createdAt', datetime.utcnow().isoformat())
        }
        
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        df.to_excel(EXCEL_FILE, index=False)
        return new_row['id']
    except Exception as e:
        print(f"Excel storage error: {e}")
        return None

def get_all_student_records():
    if not os.path.exists(EXCEL_FILE):
        return []
    try:
        df = pd.read_excel(EXCEL_FILE)
        # Convert NaN to None for JSON serialization
        df = df.where(pd.notnull(df), None)
        records = df.to_dict('records')
        # Ensure ID is string as expected by frontend
        for r in records:
            r['id'] = str(r['id'])
        # Sort by createdAt descending
        records.sort(key=lambda x: x['createdAt'], reverse=True)
        return records
    except Exception as e:
        print(f"Excel fetch error: {e}")
        return []

init_db()
