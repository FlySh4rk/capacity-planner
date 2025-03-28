from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.developer import Developer
from app.models.skill import Skill
from app.schemas.developer import DeveloperCreate, DeveloperUpdate, DeveloperResponse

router = APIRouter()

@router.post("/developers", response_model=DeveloperResponse, status_code=status.HTTP_201_CREATED)
def create_developer(developer: DeveloperCreate, db: Session = Depends(get_db)):
    db_developer = Developer(
        name=developer.name,
        email=developer.email,
        role=developer.role
    )
    
    # Add skills
    if developer.skill_ids:
        skills = db.query(Skill).filter(Skill.id.in_(developer.skill_ids)).all()
        db_developer.skills = skills
    
    db.add(db_developer)
    db.commit()
    db.refresh(db_developer)
    return db_developer

@router.get("/developers", response_model=List[DeveloperResponse])
def get_developers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    developers = db.query(Developer).offset(skip).limit(limit).all()
    return developers

@router.get("/developers/{developer_id}", response_model=DeveloperResponse)
def get_developer(developer_id: int, db: Session = Depends(get_db)):
    developer = db.query(Developer).filter(Developer.id == developer_id).first()
    if developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return developer

@router.put("/developers/{developer_id}", response_model=DeveloperResponse)
def update_developer(developer_id: int, developer_update: DeveloperUpdate, db: Session = Depends(get_db)):
    db_developer = db.query(Developer).filter(Developer.id == developer_id).first()
    if db_developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    
    # Update fields if provided
    if developer_update.name is not None:
        db_developer.name = developer_update.name
    if developer_update.email is not None:
        db_developer.email = developer_update.email
    if developer_update.role is not None:
        db_developer.role = developer_update.role
    
    # Update skills if provided
    if developer_update.skill_ids is not None:
        skills = db.query(Skill).filter(Skill.id.in_(developer_update.skill_ids)).all()
        db_developer.skills = skills
    
    db.commit()
    db.refresh(db_developer)
    return db_developer

@router.delete("/developers/{developer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_developer(developer_id: int, db: Session = Depends(get_db)):
    db_developer = db.query(Developer).filter(Developer.id == developer_id).first()
    if db_developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    
    db.delete(db_developer)
    db.commit()
    return None
