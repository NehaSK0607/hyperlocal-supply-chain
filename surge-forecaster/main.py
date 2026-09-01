from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import forecaster

app = FastAPI(title="Hyperlocal Demand Surge Forecaster")

class SurgeRequest(BaseModel):
    zoneId: str
    skuId: int
    currentDemand: int

@app.get("/")
def health_check():
    return {"status": "Surge Forecasting Service Running"}

@app.post("/api/v1/forecast/predict")
def predict_surge(request: SurgeRequest):
    try:
        return forecaster.predict_surge(request.zoneId, request.skuId, request.currentDemand)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
