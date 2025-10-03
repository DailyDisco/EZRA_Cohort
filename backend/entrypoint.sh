#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
# Check if we're using Railway's PostgreSQL or local docker-compose
if [ -n "$POSTGRES_HOST" ] && [ "$POSTGRES_HOST" != "postgres" ]; then
  # Railway PostgreSQL
  until PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
  done
else
  # Local docker-compose PostgreSQL
  echo "postgres:5432:${POSTGRES_DB}:${POSTGRES_USER}:${POSTGRES_PASSWORD}" >~/.pgpass
  chmod 600 ~/.pgpass
  export PGPASSFILE=~/.pgpass
  until PGPASSWORD="$POSTGRES_PASSWORD" psql -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
  done
fi

echo "Running database migrations..."
task migrate:up || echo "Migration failed!"
echo "Database migrations complete."

# Start cron in background
crond

# Make sure the pre-built binary has proper permissions
if [ ! -f /app/tmp/server ]; then
  echo "Binary not found, building application..."
  mkdir -p /app/tmp
  go build -o /app/tmp/server .
fi

chmod +x /app/tmp/server || echo "Could not set executable permission, continuing anyway"

# Choose whether to use Air for development or direct execution
# Default to false for Railway production, true for local development
if [ "${USE_AIR:-false}" = "true" ] && [ -f /app/.air.toml ]; then
  echo "Starting Air with pre-built binary..."
  exec air -c /app/.air.toml
else
  echo "Starting the server directly..."
  exec /app/tmp/server
fi
