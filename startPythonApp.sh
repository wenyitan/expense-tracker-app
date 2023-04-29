#!/bin/bash

# To start project
cd expense-tracker-python
nohup uvicorn expense_tracker_app:app --reload &
