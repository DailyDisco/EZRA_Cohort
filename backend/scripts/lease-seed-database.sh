#!/bin/sh

export PGPASSWORD=$POSTGRES_PASSWORD


# Database seeder script that authenticates with Clerk and creates test data

echo "🚀 Starting database seeder script..."

# Get configuration from environment variables or use defaults
API_HOST="${DOMAIN_URL:-http://localhost}"
API_PORT="${PORT:-8080}"
API_URL="${API_HOST}:${API_PORT}"

# PostgreSQL connection details from environment variables
PG_HOST="${POSTGRES_HOST:-postgres}"
PG_USER="${POSTGRES_USER:-appuser}"
PG_DB="${POSTGRES_DB:-appdb}"

echo "Using database connection: $PG_HOST / $PG_USER / $PG_DB"
echo "Using API URL: $API_URL"

# Check for required Clerk credentials
if [ -z "$CLERK_SECRET_KEY" ]; then
  echo "CLERK_SECRET_KEY must be set in environment variables."
  exit 1
fi

# Use specific Clerk user IDs for production seeding
CLERK_LANDLORD_USER_ID="user_33bWcFij7GfSChr9WtEFrffNRtq"
echo "Using Clerk landlord ID: $CLERK_LANDLORD_USER_ID"
echo "Step 0: Creating a Clerk session token..."

# Try creating a session token using a different endpoint
session_response=$(curl -s -X POST \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  "https://api.clerk.com/v1/sign_in_tokens" \
  -d "{\"user_id\": \"$CLERK_LANDLORD_USER_ID\", \"expires_in_seconds\": 3600}")

SESSION_TOKEN=$(echo "$session_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)


if [ -z "$SESSION_TOKEN" ]; then
  echo "❌ Failed to create sign-in token"
  echo "$session_response"
  exit 1
else
  echo "✅ Successfully created sign-in token: $SESSION_TOKEN"
fi

# Fetch landlord (admin) user from Clerk
admin_json=$(curl -s -X GET \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  "https://api.clerk.com/v1/users/$CLERK_LANDLORD_USER_ID")

echo "Admin metadata check:"
curl -s -X GET \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  "https://api.clerk.com/v1/users/$CLERK_LANDLORD_USER_ID/metadata" | grep -o '"public":{[^}]*}'

# Override admin details for production seeding - use our specific admin user
echo "Using production admin user details..."
admin_db_id=100
admin_first_name="Admin"
admin_last_name="User"
admin_email="admin@email.com"
admin_phone="+15551234000"

# Number of records to create (only 1 client user)
NUM_RECORDS=1

# Specific tenant email and details for client user
TENANT_CLERK_ID="user_33bWeJ1zCXC0iliXr5TgRZVYX1R"
TENANT_FIRST_NAME="Client"
TENANT_LAST_NAME="User"
TENANT_EMAIL="client@email.com"
TENANT_PHONE="+15551234001"

# Today's date and one year from today (BusyBox compatible)
TODAY=$(date +"%Y-%m-%d")
YEAR=$(date +"%Y")
MONTH=$(date +"%m")
DAY=$(date +"%d")
NEXT_YEAR=$((YEAR + 1))
ONE_YEAR="${NEXT_YEAR}-${MONTH}-${DAY}"

echo "Using date range: $TODAY to $ONE_YEAR"

# Tenant data is now defined above as individual variables
# Apartment data removed - only seeding users for production

# Helper function to get an item from a space-separated list by index
get_item() {
  echo "$1" | cut -d' ' -f$2
}

# Helper function to extract only the number from PostgreSQL output
extract_id() {
  echo "$1" | grep -o '[0-9]\+' | head -1
}
make_api_call() {
  method=$1
  endpoint=$2
  data=$3

  echo "➡️ Calling $API_URL$endpoint"
  echo "📦 Payload: $data"
# AM I 100% on the endpoint path? And on the method that I hidding?
  response=$(curl -s -w "\n🔁 HTTP Status: %{http_code}\n" -X $method \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $SESSION_TOKEN" \
    -d "$data" \
    "$API_URL$endpoint")
  echo $API_URL$endpoint
  echo "$response"
}


# Arrays to store IDs (using temporary files for BusyBox compatibility)
TENANT_IDS_FILE=$(mktemp)
APARTMENT_IDS_FILE=$(mktemp)
LEASE_IDS_FILE=$(mktemp)

echo "Step 1: Creating admin user with ID $admin_db_id..."

# Check if admin user already exists by Clerk ID
ADMIN_EXISTS=$(psql -h $PG_HOST -U $PG_USER -d $PG_DB -t -c "SELECT COUNT(*) FROM users WHERE clerk_id = '$CLERK_LANDLORD_USER_ID';")
ADMIN_EXISTS=$(extract_id "$ADMIN_EXISTS")

if [ "$ADMIN_EXISTS" -eq "0" ]; then
  echo "Creating new admin user..."

  # Check if the desired ID is available
  ID_EXISTS=$(psql -h $PG_HOST -U $PG_USER -d $PG_DB -t -c "SELECT COUNT(*) FROM users WHERE id = $admin_db_id;")
  ID_EXISTS=$(extract_id "$ID_EXISTS")

  if [ "$ID_EXISTS" -eq "0" ]; then
    # Create the admin user with the specified ID
    psql -h $PG_HOST -U $PG_USER -d $PG_DB -c "
    INSERT INTO users (id, clerk_id, first_name, last_name, email, phone, role, status)
    OVERRIDING SYSTEM VALUE
    VALUES ($admin_db_id, '$CLERK_LANDLORD_USER_ID', '$admin_first_name', '$admin_last_name', '$admin_email', '$admin_phone', 'admin', 'active');
    "
    echo "Created admin user with ID: $admin_db_id"
  else
    # ID is taken, insert without specifying ID
    psql -h $PG_HOST -U $PG_USER -d $PG_DB -c "
    INSERT INTO users (clerk_id, first_name, last_name, email, phone, role, status)
    VALUES ('$CLERK_LANDLORD_USER_ID', '$admin_first_name', '$admin_last_name', '$admin_email', '$admin_phone', 'admin', 'active');
    "
    echo "Created admin user (ID auto-assigned)"
  fi
else
  echo "Admin user already exists"
  # Update the admin_db_id to the existing user's ID
  EXISTING_ID=$(psql -h $PG_HOST -U $PG_USER -d $PG_DB -t -c "SELECT id FROM users WHERE clerk_id = '$CLERK_LANDLORD_USER_ID';")
  admin_db_id=$(extract_id "$EXISTING_ID")
  echo "Using existing admin user with ID: $admin_db_id"
fi

# Create client user
echo "Step 2: Creating client user..."

# Check if user already exists
USER_EXISTS=$(psql -h $PG_HOST -U $PG_USER -d $PG_DB -t -c "SELECT COUNT(*) FROM users WHERE clerk_id = '$TENANT_CLERK_ID';")
USER_EXISTS=$(extract_id "$USER_EXISTS")

if [ "$USER_EXISTS" -eq "0" ]; then
  echo "Creating new client user..."
  # Create tenant user
  TENANT_SQL="INSERT INTO users (clerk_id, first_name, last_name, email, phone, role, status)
             VALUES ('$TENANT_CLERK_ID', '$TENANT_FIRST_NAME', '$TENANT_LAST_NAME', '$TENANT_EMAIL', '$TENANT_PHONE', 'tenant', 'active')
             RETURNING id;"

  TENANT_ID_RAW=$(psql -h $PG_HOST -U $PG_USER -d $PG_DB -t -c "$TENANT_SQL")
  TENANT_ID=$(extract_id "$TENANT_ID_RAW")
  echo "Created client user with ID: $TENANT_ID"
else
  echo "Client user already exists, getting existing ID..."
  TENANT_ID_RAW=$(psql -h $PG_HOST -U $PG_USER -d $PG_DB -t -c "SELECT id FROM users WHERE clerk_id = '$TENANT_CLERK_ID';")
  TENANT_ID=$(extract_id "$TENANT_ID_RAW")
  echo "Using existing client user with ID: $TENANT_ID"
fi

# Check for ID conflicts (shouldn't happen but just in case)
if [ "$TENANT_ID" -eq "$admin_db_id" ]; then
  echo "WARNING: Tenant ID ($TENANT_ID) conflicts with admin ID ($admin_db_id). This is unexpected."
fi

echo "Created client user: $TENANT_FIRST_NAME $TENANT_LAST_NAME (ID: $TENANT_ID)"

# Store ID for later use
echo "$TENANT_ID" >> $TENANT_IDS_FILE
echo "✅ Created client user"

# Apartments and leases creation removed - only seeding users for production
# Clean up temporary files
rm -f $TENANT_IDS_FILE $APARTMENT_IDS_FILE $LEASE_IDS_FILE

echo "✅ Database user seeding completed!"
echo "Production users admin@email.com and client@email.com have been created."
echo "Next step: Run the Go seeder to populate mock data for these users."