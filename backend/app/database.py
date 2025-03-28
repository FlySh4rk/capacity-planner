from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

# Ottieni l'URL del database dalle variabili d'ambiente o usa un valore predefinito
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db/capacity_planning")
print(f"DEBUG: Connessione al database con URL: {DATABASE_URL}")

# Crea il motore SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
