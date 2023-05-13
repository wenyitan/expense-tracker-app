#!/bin/bash

# To start project
cd /Users/wenyi/ProjectWorkspace/ExpenseTrackerApp/weight-tracker-python
nohup uvicorn weight_tracker_app:app --reload --port 8001 &
echo "Python app started"
