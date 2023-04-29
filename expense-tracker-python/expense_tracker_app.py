from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transaction_service import save_transaction as save
from category_service import get_all_categories
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

class AddTransactionBody(BaseModel):
    name: str
    type: str
    amount: float 
    date: str 
    category: str 
    remarks: str


@app.post("/add-transaction")
async def add_transaction(addTransactionBody: AddTransactionBody):
    try:
        savedTransaction = save(addTransactionBody)
        return {"message": "Transaction Saved", "transaction": savedTransaction}
    except Exception as e:
        raise HTTPException(status_code = 500, detail = traceback.format_exc())

@app.get("/categories/{transactionType}")
async def get_categories(transactionType: str, response_model=dict):
    try:
        return {"message": f"{transactionType} type categories retrieved", "categories": get_all_categories()[transactionType]}
    except Exception as e:
        raise HTTPException(status_code = 500, detail = traceback.format_exc()) 