#!/bin/bash

# Script per correggere l'errore di sintassi nel backend FastAPI

# Verifica che il file main.py esista
if [ ! -f "backend/app/main.py" ]; then
    echo "ERRORE: File backend/app/main.py non trovato"
    exit 1
fi

# Correggi la riga con l'errore
sed -i 's/app = FastAPI(root_path="\/api",root_path="\/api",root_path="\/api"title="Capacity Planning API")/app = FastAPI(root_path="\/api", title="Capacity Planning API")/g' backend/app/main.py

# Verifica che la modifica sia stata applicata
if grep -q 'app = FastAPI(root_path="/api", title="Capacity Planning API")' backend/app/main.py; then
    echo "Correzione applicata con successo!"
    echo "Riavvio i container..."
    docker compose down
    docker compose up -d
else
    echo "ERRORE: Correzione non riuscita, verifica manualmente il file backend/app/main.py"
    exit 1
fi