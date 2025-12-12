import joblib
import pandas as pd
import os

# Path to the ml_engine folder (Sibling to backend)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../../../ml_engine/models")

class MLEngine:
    def __init__(self):
        try:
            print(f"Loading models from {MODEL_PATH}...")
            self.model = joblib.load(os.path.join(MODEL_PATH, "rf_model.joblib"))
            self.preprocessor = joblib.load(os.path.join(MODEL_PATH, "preprocessor.joblib"))
        except Exception as e:
            print(f"Error loading models: {e}")

    def predict(self, data: dict):
        df = pd.DataFrame([data])
        processed = self.preprocessor.transform(df)
        pred = self.model.predict(processed)[0]
        prob = self.model.predict_proba(processed)[0][1]

        return {
            "is_threat": bool(pred == 1),
            "confidence": float(prob),
            "severity": "Critical" if prob > 0.8 else "High" if prob > 0.5 else "Low"
        }

ml_engine = MLEngine()