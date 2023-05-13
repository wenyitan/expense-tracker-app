#!/bin/bash

# To start project

toKill1= lsof -i :8000
toKill2= lsof -i :3000

sh startPythonApp.sh
sh startReactApp.sh

echo $toKill1
echo $toKill2