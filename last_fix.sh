#!/bin/bash

echo "=== Script di debug risposta API ==="

# Verifica le risposte API
echo "1. Verifica risposta API developers:"
curl -s http://localhost:8000/developers | jq '.'

echo "2. Verifica risposta API skills:"
curl -s http://localhost:8000/skills | jq '.'

echo "3. Verifica risposta API projects:"
curl -s http://localhost:8000/projects | jq '.'

echo "4. Verifica risposta API allocations:"
curl -s http://localhost:8000/allocations | jq '.'

# Ora controlliamo il formato atteso confrontando con il nostro backend minimal che funzionava
echo "5. Confronto con il formato del backend minimal:"
echo "Risposta minimal developers:"
cat backend/minimal_backend.py | grep -A 10 "get_developers" | grep -A 8 "return"

echo "6. Correzione formati API se necessario..."