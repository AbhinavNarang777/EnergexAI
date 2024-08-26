from typing import Optional, List, Dict
from pydantic import BaseModel


class CorrectionRequest(BaseModel):
    date: str
    actual: str
    predicted: List[float]


class QnARequest(BaseModel):
    user_query: str
