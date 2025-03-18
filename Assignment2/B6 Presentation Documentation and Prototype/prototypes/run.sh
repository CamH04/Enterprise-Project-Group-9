#!/bin/bash
npm install
cd api || { echo "Failed to navigate to api directory"; exit 1; }
node server.js &
node index.js &
cd ../site || { echo "Failed to navigate to site directory"; exit 1; }
npm install
npm run start &
wait
