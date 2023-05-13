#!/bin/bash

# To start project

toKill1= lsof -i :8000
toKill2= lsof -i :3000
toKill3= lsof -i :8001


sh startExpenseApp.sh
sh startReactApp.sh
sh startWeightApp.sh

echo $toKill1
echo $toKill2
echo $toKill3