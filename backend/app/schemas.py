# from typing import List
# from pydantic import BaseModel

# class Prediction(BaseModel):
#     source: str
#     true_label: int
#     predicted: str
#     score: float

# class BulkPredictionRequest(BaseModel):
#     data: List[dict]

# class BulkPredictionResponse(BaseModel):
#     results: List[Prediction]
#     record_id: str

# class UserSchema(BaseModel):
#     username: str
#     role: str  # e.g. "user" or "admin"

# class ModelSchema(BaseModel):
#     name: str
#     version: str



from typing import List, Dict
from pydantic import BaseModel

class BulkPredictionRequest(BaseModel):
    data: List[Dict]  # each dict is one sample's raw features

class Prediction(BaseModel):
    label: str
    probability: float
    features: Dict     # original input features for this prediction

class BulkPredictionResponse(BaseModel):
    predictions: List[Prediction]
