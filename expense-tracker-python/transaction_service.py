import csv
import pandas as pd
import datetime as datetime

def save_transaction(transaction):
    with open("transactions.csv", "a", newline="") as file:
        transaction = transaction.dict()
        headers = list(transaction.keys())
        writer = csv.DictWriter(file, fieldnames=headers)
        # writer.writeheader()
        writer.writerow(transaction)
        return transaction

def get_all_transactions():
    transactions_data = pd.read_csv("transactions.csv")
    return(transactions_data.fillna(value='', inplace=False).to_dict(orient="records"))

def get_transactions_by_month(person, month_year):
    df = pd.read_csv("transactions.csv")
    df["id"] = pd.read_csv("transactions.csv").index
    wanted_month_year = datetime.datetime.strptime(month_year, "%b-%Y")
    transactions_data = df.fillna(value='', inplace=False).to_dict(orient="records")
    transactions_in_month_year = [ data for data in transactions_data if (data["name"] == person and datetime.datetime.strptime(data["date"], "%d/%m/%Y").month == wanted_month_year.month and datetime.datetime.strptime(data["date"], "%d/%m/%Y").year == wanted_month_year.year)]
    return(transactions_in_month_year)