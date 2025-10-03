#!/bin/sh
set -e

if [ "$NODE_ENV" = "production" ]; then
  echo "Building for production..."
  npm run build
  echo "Starting production server..."
  exec npx serve -s dist -l 3000
else
  echo "Starting development server..."
  exec npm run dev -- --host 0.0.0.0
fi
