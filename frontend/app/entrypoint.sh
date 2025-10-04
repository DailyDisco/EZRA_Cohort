#!/bin/sh
set -e

# Function to wait for a service to be ready
wait_for_service() {
  local service=$1
  local port=$2
  local timeout=${3:-30}

  echo "Waiting for $service on port $port..."
  for i in $(seq 1 $timeout); do
    if nc -z $service $port 2>/dev/null; then
      echo "$service is ready!"
      return 0
    fi
    echo "Attempt $i/$timeout: $service not ready yet..."
    sleep 1
  done

  echo "Timeout waiting for $service"
  return 1
}

if [ "$NODE_ENV" = "production" ]; then
  echo "Starting production server with nginx..."
  # Check if we're running in Docker with nginx
  if [ -f "/usr/share/nginx/html/index.html" ]; then
    echo "Using nginx for static file serving..."
    exec nginx -g "daemon off;"
  else
    echo "Falling back to serve for production..."
    exec npx serve -s dist -l 3000
  fi
else
  echo "Starting development server..."
  exec npm run dev -- --host 0.0.0.0
fi
