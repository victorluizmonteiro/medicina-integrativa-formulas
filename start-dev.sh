#!/bin/bash
export NVM_DIR="/usr/local/Cellar/nvm/0.39.5"
source /usr/local/Cellar/nvm/0.39.5/nvm.sh
nvm use 20
exec npm run dev
