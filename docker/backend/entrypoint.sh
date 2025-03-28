#!/bin/bash
set -e

echo "=== entrypoint.sh avviato ==="

# Verifica comando pg_isready
if command -v pg_isready >/dev/null 2>&1; then
  echo "pg_isready è disponibile"
else
  echo "pg_isready non è disponibile, installazione di postgresql-client"
  apt-get update && apt-get install -y postgresql-client
fi

# Funzione per attendere che PostgreSQL sia pronto
wait_for_postgres() {
  echo "Attesa avvio PostgreSQL..."
  until pg_isready -h db -p 5432 -U postgres; do
    echo "PostgreSQL non pronto - attesa..."
    sleep 2
  done
  echo "PostgreSQL è pronto!"
}

# Attendi che il database sia pronto
wait_for_postgres

echo "Inizializzazione del database..."
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

echo "Avvio dell'applicazione FastAPI..."
cd /app
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
