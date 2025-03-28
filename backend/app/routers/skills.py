from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse

# IMPORTANTE: Definiamo il router SENZA prefisso
router = APIRouter()

# IMPORTANTE: Definiamo esplicitamente i percorsi completi

@router.post("/skills", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db)):
    """Crea una nuova skill"""
    print(f"DEBUG: Creating skill: {skill}")
    db_skill = Skill(name=skill.name, category=skill.category)
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.get("/skills", response_model=List[SkillResponse])
def get_skills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Ottiene tutte le skills"""
    skills = db.query(Skill).offset(skip).limit(limit).all()
    return skills

@router.get("/skills/{skill_id}", response_model=SkillResponse)
def get_skill(skill_id: int, db: Session = Depends(get_db)):
    """Ottiene una skill specifica per ID"""
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill

@router.put("/skills/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: int, skill_update: SkillUpdate, db: Session = Depends(get_db)):
    """Aggiorna una skill esistente"""
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    if skill_update.name is not None:
        db_skill.name = skill_update.name
    if skill_update.category is not None:
        db_skill.category = skill_update.category
    
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(skill_id: int, db: Session = Depends(get_db)):
    """Elimina una skill"""
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(db_skill)
    db.commit()
    return None
