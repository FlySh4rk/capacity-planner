#!/bin/bash

# Ferma tutti i container
echo "Arresto dei container..."
docker compose down

# Modifica i file direttamente nella directory del progetto (non nel container)
echo "Correzione dei file sorgente..."

# Correggi il file main.py
echo "Correzione di main.py..."
cat > backend/app/main.py << 'EOF'
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.database import Base, engine
from app.routers import skills, developers, projects, allocations, reports

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Capacity Planning API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(skills.router)
app.include_router(developers.router)
app.include_router(projects.router)
app.include_router(allocations.router)
app.include_router(reports.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Capacity Planning API"}

# Debug endpoint to show all registered routes
@app.get("/debug/routes")
def get_routes():
    routes = []
    for route in app.routes:
        routes.append({
            "path": route.path,
            "name": route.name,
            "methods": route.methods if hasattr(route, "methods") else None
        })
    return {"routes": routes}

# Debug middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"DEBUG: Request received: {request.method} {request.url.path}")
    response = await call_next(request)
    print(f"DEBUG: Response: {response.status_code}")
    return response

# run the application
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)
EOF

# Modifica il modello di allocation.py per rimuovere la relazione problematica
echo "Aggiornamento del modello allocation.py..."
cat > backend/app/models/allocation.py << 'EOF'
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Allocation(Base):
    __tablename__ = "allocations"
    
    id = Column(Integer, primary_key=True, index=True)
    developer_id = Column(Integer, ForeignKey("developers.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime)
    allocation_percentage = Column(Float, default=100.0)  # Percentuale di tempo allocato
    
    # Relationships
    developer = relationship("Developer", back_populates="allocations")
    project = relationship("Project", back_populates="allocations")
EOF

# Disattiva temporaneamente la relazione project_manager in ProjectManager
echo "Aggiornamento di project_manager.py..."
cat > backend/app/models/project_manager.py << 'EOF'
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class ProjectManager(Base):
    __tablename__ = "project_managers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    
    # Commentiamo la relazione problematica
    # allocations = relationship("Allocation", back_populates="project_manager")
EOF

# Correggi l'import nel modello __init__.py
echo "Aggiornamento di __init__.py..."
cat > backend/app/models/__init__.py << 'EOF'
# Models package
# Questo file è importante per garantire il corretto ordine di importazione
from app.models.developer import Developer, developer_skill
from app.models.skill import Skill
from app.models.project import Project
from app.models.allocation import Allocation
# from app.models.project_manager import ProjectManager
EOF

# Ricostruisci e riavvia i container
echo "Ricostruzione e riavvio dei container..."
docker compose build backend
docker compose up -d

echo "Fatto! Aspetta qualche secondo che il backend si avvii completamente."
echo "Controlla i log con: docker compose logs -f backend"