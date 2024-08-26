from typing import Optional, List, Dict
from pydantic import BaseModel


class PredictRequest(BaseModel):
    num_predict: int

class ActualDataRequest(BaseModel):
    date: str
