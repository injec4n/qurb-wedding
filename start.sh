#!/bin/bash
cd /home/z/my-project
while true; do
  node node_modules/.bin/next dev -p 3000 2>&1 | tee dev.log
  echo "Server crashed at $(date), restarting in 3s..." >> /tmp/restarts.log
  sleep 3
done
