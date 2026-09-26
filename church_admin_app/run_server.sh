#!/bin/bash
# Sanctus Local Development Server Launcher

PORT=8000
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "----------------------------------------------------"
echo "Life Changer Prophetical Church Administration Portal"
echo "----------------------------------------------------"
echo "Serving files from: $DIR"

# Check if port 8000 is already in use, find an available one if so
while lsof -i :$PORT -t >/dev/null ; do
    echo "Port $PORT is already in use. Checking next port..."
    PORT=$((PORT+1))
done

echo "Starting local Python web server on http://localhost:$PORT ..."
echo "Press Ctrl+C to stop the server."
echo "----------------------------------------------------"

python3 -m http.server $PORT -d "$DIR"
