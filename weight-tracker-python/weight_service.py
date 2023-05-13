import csv
import pandas as pd
import datetime as datetime
from pathlib import Path


def save_weight(weight):
    with open("weight.csv", "a", newline="") as file:
        weight = weight.dict()
        headers = list(weight.keys())
        writer = csv.DictWriter(file, fieldnames=headers)
        writer.writeheader()
        writer.writerow(weight)
        return weight

def get_all_weight():
    path = Path(__file__).parent.joinpath("weight.csv")
    weight_data = pd.read_csv(path)
    # weight_data["Weight 2x"] = weight_data["weight"] * 2
    # weight_data["change"] = weight_data["weight"].diff(1)
    return weight_data.assign(
        dailyChange=round(weight_data["weight"].diff(1), 2),
        weeklyAverage=round(weight_data["weight"].rolling(8).mean(), 2),
        weeklyAverageChange = lambda col: round(col["weeklyAverage"].diff(1), 2)
        ).fillna(value='', inplace=False).to_dict(orient="records")
    