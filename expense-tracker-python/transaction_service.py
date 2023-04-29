import csv

def save_transaction(transaction):
    with open("transactions.csv", "a", newline="") as file:
        transaction = transaction.dict()
        headers = list(transaction.keys())
        writer = csv.DictWriter(file, fieldnames=headers)
        # writer.writeheader()
        writer.writerow(transaction)
        return transaction
