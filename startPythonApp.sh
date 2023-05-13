#!/bin/bash

# To start project
cd /Users/wenyi/ProjectWorkspace/ExpenseTrackerApp/expense-tracker-python
nohup uvicorn expense_tracker_app:app --reload &
echo "Python app started"
