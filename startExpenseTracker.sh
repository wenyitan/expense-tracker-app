#!/bin/bash

# To start project

toKill1= lsof -i :8000
toKill2= lsof -i :3000

# if [ toKill1 ] then echo "Eh"
#     else echo "What"
# fi

sh startPythonApp.sh
sh startReactApp.sh


echo $toKill1
echo $toKill2