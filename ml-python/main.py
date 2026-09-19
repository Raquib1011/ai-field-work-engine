import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Field Work Match Scoring API")

# Load trained Scikit-Learn model on startup
MODEL_PATH = "model.joblib"
if not os.path.exists(MODEL_PATH):
    raise RuntimeError("Model file not found! Run 'python train_model.py' first.")

model = joblib.load(MODEL_PATH)

class Skill(BaseModel):
    skill_name: str
    experience_years: int

class MatchRequest(BaseModel):
    technician_skills: List[Skill]
    required_skills: List[str]
    urgency_level: int = 2  # 1: Low, 2: Medium, 3: High
    distance_km: float = 10.0

@app.get("/")
def read_root():
    return {"status": "OK", "service": "Scikit-Learn ML Match Microservice"}

@app.post("/predict-match")
def predict_match(data: MatchRequest):
    tech_skills = {s.skill_name.lower(): s.experience_years for s in data.technician_skills}
    required = [r.lower() for r in data.required_skills]

    if not required:
        return {"match_score": 0.0, "details": "No required skills specified"}

    # Extract numerical features for the ML model
    matched_count = sum(1 for req in required if req in tech_skills)
    total_experience = sum(tech_skills.get(req, 0) for req in required)
    
    skill_match_ratio = matched_count / len(required)

    # Format inputs into pandas DataFrame expected by Scikit-Learn
    features = pd.DataFrame([{
        'skill_match_ratio': skill_match_ratio,
        'total_experience': total_experience,
        'urgency_level': data.urgency_level,
        'distance_km': data.distance_km
    }])

    # Generate probability of successful match from Random Forest model
    probabilities = model.predict_proba(features)
    match_probability = round(float(probabilities[0][1]) * 100, 2)

    return {
        "match_score": match_probability,
        "features_evaluated": {
            "skill_match_ratio": round(skill_match_ratio, 2),
            "total_experience_years": total_experience,
            "urgency_level": data.urgency_level,
            "distance_km": data.distance_km
        }
    }