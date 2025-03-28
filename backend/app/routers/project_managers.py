from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.project_manager import ProjectManager
from app.schemas.project_manager import ProjectManagerCreate, ProjectManagerUpdate, ProjectManagerResponse

router = APIRouter()

@router.post("/project-managers", response_model=ProjectManagerResponse, status_code=status.HTTP_201_CREATED)
def create_project_manager(project_manager: ProjectManagerCreate, db: Session = Depends(get_db)):
    db_project_manager = ProjectManager(
        name=project_manager.name,
        email=project_manager.email
    )
    
    db.add(db_project_manager)
    db.commit()
    db.refresh(db_project_manager)
    return db_project_manager

@router.get("/project-managers", response_model=List[ProjectManagerResponse])
def get_project_managers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    project_managers = db.query(ProjectManager).offset(skip).limit(limit).all()
    return project_managers

@router.get("/project-managers/{project_manager_id}", response_model=ProjectManagerResponse)
def get_project_manager(project_manager_id: int, db: Session = Depends(get_db)):
    project_manager = db.query(ProjectManager).filter(ProjectManager.id == project_manager_id).first()
    if project_manager is None:
        raise HTTPException(status_code=404, detail="Project manager not found")
    return project_manager

@router.put("/project-managers/{project_manager_id}", response_model=ProjectManagerResponse)
def update_project_manager(project_manager_id: int, project_manager_update: ProjectManagerUpdate, db: Session = Depends(get_db)):
    db_project_manager = db.query(ProjectManager).filter(ProjectManager.id == project_manager_id).first()
    if db_project_manager is None:
        raise HTTPException(status_code=404, detail="Project manager not found")
    
    # Update fields if provided
    if project_manager_update.name is not None:
        db_project_manager.name = project_manager_update.name
    if project_manager_update.email is not None:
        db_project_manager.email = project_manager_update.email
    
    db.commit()
    db.refresh(db_project_manager)
    return db_project_manager

@router.delete("/project-managers/{project_manager_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_manager(project_manager_id: int, db: Session = Depends(get_db)):
    db_project_manager = db.query(ProjectManager).filter(ProjectManager.id == project_manager_id).first()
    if db_project_manager is None:
        raise HTTPException(status_code=404, detail="Project manager not found")
    
    db.delete(db_project_manager)
    db.commit()
    return None
