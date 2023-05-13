from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from weight_service import save_weight as save
from weight_service import get_all_weight
import traceback
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AddWeightBody(BaseModel):
    amount: float 
    date: str 

@app.post("/add-weight")
async def add_weight(addWeightBody: AddWeightBody):
    try:
        savedWeight = save(addWeightBody)
        return {"message": "Weight Saved", "weightRecord": savedWeight}
    except Exception as e:
        raise HTTPException(status_code = 500, detail = traceback.format_exc())
    
@app.get("/weights")
async def get_transactions(response_model=dict):
        try:
            return {"message": "All weight retrieved", "weights": get_all_weight()}
        except Exception as e:
            raise HTTPException(status_code = 500, detail = traceback.format_exc()) 