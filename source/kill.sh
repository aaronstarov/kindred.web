kill $(ps aux | grep 'dev/server.js' | awk '{print $2}')
