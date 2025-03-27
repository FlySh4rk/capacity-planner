#!/bin/bash
set -e

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
  echo "Waiting for PostgreSQL..."
  while ! pg_isready -h db -p 5432 -U postgres > /dev/null 2>&1; do
    sleep 1
  done
  echo "PostgreSQL is ready!"
}

# Wait for the database to be ready
wait_for_postgres

# Initialize the database and create the tables
echo "Initializing database..."
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Check if we should load sample data
if [ "$LOAD_SAMPLE_DATA" = "true" ]; then
  echo "Loading sample data..."
  # [contenuto del caricamento dati...]
fi

# Start the application
echo "Starting FastAPI application with no-redirect..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --no-redirect
