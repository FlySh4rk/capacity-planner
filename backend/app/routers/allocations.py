from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.allocation import Allocation
from app.models.developer import Developer
from app.models.project import Project
from app.models.project_manager import ProjectManager
from app.schemas.allocation import AllocationCreate, AllocationUpdate, AllocationResponse

router = APIRouter()

@router.post("/allocations", response_model=AllocationResponse, status_code=status.HTTP_201_CREATED)
def create_allocation(allocation: AllocationCreate, db: Session = Depends(get_db)):
    # Check if developer exists
    developer = db.query(Developer).filter(Developer.id == allocation.developer_id).first()
    if not developer:
        raise HTTPException(status_code=404, detail="Developer not found")
    
    # Check if project exists
    project = db.query(Project).filter(Project.id == allocation.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if project manager exists if provided
    project_manager = None
    if allocation.pm_id:
        project_manager = db.query(ProjectManager).filter(ProjectManager.id == allocation.pm_id).first()
        if not project_manager:
            raise HTTPException(status_code=404, detail="Project Manager not found")
    
    # Create allocation
    db_allocation = Allocation(
        developer_id=allocation.developer_id,
        project_id=allocation.project_id,
        start_date=allocation.start_date,
        end_date=allocation.end_date,
        allocation_percentage=allocation.allocation_percentage,
        pm_id=allocation.pm_id,
        status=allocation.status or "IDLE",
        notes=allocation.notes
    )
    
    db.add(db_allocation)
    db.commit()
    db.refresh(db_allocation)
    
    # Return with additional information
    response = {
        **db_allocation.__dict__,
        "developer_name": developer.name,
        "project_name": project.name,
        "pm_name": project_manager.name if project_manager else None
    }
    
    return response

# Rest of the router remains the same as in previous implementations
