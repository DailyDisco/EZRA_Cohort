#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."

# Variables for database connection
DB_HOST=""
DB_USER=""
DB_PASSWORD=""
DB_NAME=""

# Check if we're running in a Railway environment (PGHOST is set by Railway)
if [ -n "$PGHOST" ]; then
  DB_HOST="$PGHOST"
  DB_USER="$PGUSER"
  DB_PASSWORD="$PGPASSWORD"
  DB_NAME="$PGDATABASE"
  PG_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}?sslmode=disable"
  
  # Railway does not need ~/.pgpass or PGPASSFILE for psql or migrate tools
else
  # Local docker-compose environment
  DB_HOST="postgres"
  DB_USER="${POSTGRES_USER:-appuser}"
  DB_PASSWORD="${POSTGRES_PASSWORD:-apppassword}"
  DB_NAME="${POSTGRES_DB:-appdb}"
  PG_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}?sslmode=disable"

  echo "${DB_HOST}:5432:${DB_NAME}:${DB_USER}:${DB_PASSWORD}" >~/.pgpass
  chmod 600 ~/.pgpass
  export PGPASSFILE=~/.pgpass
fi

# Export PG_URL for the Go application
export PG_URL

until PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "Running database migrations..."
# Pass the dynamically generated PG_URL to the migrate command directly
migrate -path internal/db/migrations/ -database "$PG_URL" -verbose up || echo "Migration failed!"
echo "Database migrations complete."

# Check if we should seed the database (only in production with specific environment variable)
if [ "${SEED_PRODUCTION_DATA:-false}" = "true" ]; then
  echo "Production seeding enabled. Starting database seeding process..."

  # Seed production users first
  echo "Step 1: Seeding production users..."
  if [ -f scripts/lease-seed-database.sh ]; then
    chmod +x scripts/lease-seed-database.sh
    # Set environment variables for the seeding script
    export POSTGRES_HOST="$DB_HOST"
    export POSTGRES_USER="$DB_USER"
    export POSTGRES_DB="$DB_NAME"
    export POSTGRES_PASSWORD="$DB_PASSWORD"

    ./scripts/lease-seed-database.sh || echo "User seeding failed, continuing..."
  else
    echo "Warning: lease-seed-database.sh not found, skipping user seeding"
  fi

  # Seed production data (work orders, complaints, etc.)
  echo "Step 2: Seeding production data..."
  if [ -f scripts/seed_production_data.go ]; then
    go run scripts/seed_production_data.go || echo "Data seeding failed, continuing..."
  else
    echo "Warning: seed_production_data.go not found, skipping data seeding"
  fi

  echo "Database seeding complete."
else
  echo "Production seeding disabled. Skipping database seeding."
fi

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
