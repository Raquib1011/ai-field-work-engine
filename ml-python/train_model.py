import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Set seed for reproducibility
np.random.seed(42)
n_samples = 1200

# Generate realistic synthetic field dispatch data
skill_match_ratio = np.random.uniform(0.0, 1.0, n_samples)
total_experience = np.random.randint(0, 15, n_samples)
urgency_level = np.random.randint(1, 4, n_samples)  # 1: Low, 2: Medium, 3: High
distance_km = np.random.uniform(1.0, 50.0, n_samples)

# Formula to define ground truth assignment success (with slight noise)
match_score = (
    (skill_match_ratio * 0.45) + 
    (total_experience / 15 * 0.30) + 
    (urgency_level / 3 * 0.10) - 
    (distance_km / 50 * 0.25)
)
is_match = (match_score > 0.35).astype(int)

# Create DataFrame
df = pd.DataFrame({
    'skill_match_ratio': skill_match_ratio,
    'total_experience': total_experience,
    'urgency_level': urgency_level,
    'distance_km': distance_km,
    'is_match': is_match
})

X = df[['skill_match_ratio', 'total_experience', 'urgency_level', 'distance_km']]
y = df['is_match']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Random Forest Classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model binary to disk
joblib.dump(model, 'model.joblib')
print("Model trained successfully! Saved to ml-python/model.joblib")