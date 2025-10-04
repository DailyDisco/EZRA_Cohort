#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."

# Check if we're running in a Railway environment (PGHOST is set by Railway)
if [ -n "$PGHOST" ]; then
  DB_HOST="$PGHOST"
  DB_USER="$PGUSER"
  DB_PASSWORD="$PGPASSWORD"
  DB_NAME="$PGDATABASE"
  
  # Railway does not need ~/.pgpass or PGPASSFILE
else
  # Local docker-compose environment
  DB_HOST="postgres"
  DB_USER="$POSTGRES_USER"
  DB_PASSWORD="$POSTGRES_PASSWORD"
  DB_NAME="$POSTGRES_DB"

  echo "postgres:5432:${DB_NAME}:${DB_USER}:${DB_PASSWORD}" >~/.pgpass
  chmod 600 ~/.pgpass
  export PGPASSFILE=~/.pgpass
fi

until PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

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
