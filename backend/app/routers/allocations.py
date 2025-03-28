from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.allocation import Allocation
from app.models.developer import Developer
from app.models.project import Project
from app.schemas.allocation import AllocationCreate, AllocationUpdate, AllocationResponse

router = APIRouter()

@router.get("/allocations", response_model=List[AllocationResponse])
def get_allocations(
    skip: int = 0, 
    limit: int = 100, 
    developer_id: int = None, 
    project_id: int = None, 
    db: Session = Depends(get_db)
):
    # Base query
    query = db.query(
        Allocation, 
        Developer.name.label("developer_name"), 
        Project.name.label("project_name")
    ).join(
        Developer, Allocation.developer_id == Developer.id
    ).join(
        Project, Allocation.project_id == Project.id
    )
    
    # Apply filters if provided
    if developer_id:
        query = query.filter(Allocation.developer_id == developer_id)
    if project_id:
        query = query.filter(Allocation.project_id == project_id)
    
    # Paginate results
    results = query.offset(skip).limit(limit).all()
    
    # Transform query results to response model
    allocations = []
    for allocation, developer_name, project_name in results:
        allocation_dict = {**allocation.__dict__}
        allocation_dict["developer_name"] = developer_name
        allocation_dict["project_name"] = project_name
        allocations.append(allocation_dict)
    
    return allocations

@router.get("/allocations/{allocation_id}", response_model=AllocationResponse)
def get_allocation(allocation_id: int, db: Session = Depends(get_db)):
    # Query allocation with joined info
    result = db.query(
        Allocation, 
        Developer.name.label("developer_name"), 
        Project.name.label("project_name")
    ).join(
        Developer, Allocation.developer_id == Developer.id
    ).join(
        Project, Allocation.project_id == Project.id
    ).filter(Allocation.id == allocation_id).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Allocation not found")
    
    allocation, developer_name, project_name = result
    allocation_dict = {**allocation.__dict__}
    allocation_dict["developer_name"] = developer_name
    allocation_dict["project_name"] = project_name
    
    return allocation_dict

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
    
    # Create allocation
    db_allocation = Allocation(
        developer_id=allocation.developer_id,
        project_id=allocation.project_id,
        start_date=allocation.start_date,
        end_date=allocation.end_date,
        allocation_percentage=allocation.allocation_percentage
    )
    
    db.add(db_allocation)
    db.commit()
    db.refresh(db_allocation)
    
    # Return with additional information
    response = {
        **db_allocation.__dict__,
        "developer_name": developer.name,
        "project_name": project.name
    }
    
    return response

@router.put("/allocations/{allocation_id}", response_model=AllocationResponse)
def update_allocation(allocation_id: int, allocation_update: AllocationUpdate, db: Session = Depends(get_db)):
    # Get allocation with joined info
    result = db.query(
        Allocation, 
        Developer.name.label("developer_name"), 
        Project.name.label("project_name")
    ).join(
        Developer, Allocation.developer_id == Developer.id
    ).join(
        Project, Allocation.project_id == Project.id
    ).filter(Allocation.id == allocation_id).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Allocation not found")
    
    allocation, developer_name, project_name = result
    
    # Update fields if provided
    if allocation_update.start_date is not None:
        allocation.start_date = allocation_update.start_date
    if allocation_update.end_date is not None:
        allocation.end_date = allocation_update.end_date
    if allocation_update.allocation_percentage is not None:
        allocation.allocation_percentage = allocation_update.allocation_percentage
    
    db.commit()
    db.refresh(allocation)
    
    # Return updated data
    allocation_dict = {**allocation.__dict__}
    allocation_dict["developer_name"] = developer_name
    allocation_dict["project_name"] = project_name
    
    return allocation_dict

@router.delete("/allocations/{allocation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_allocation(allocation_id: int, db: Session = Depends(get_db)):
    db_allocation = db.query(Allocation).filter(Allocation.id == allocation_id).first()
    if db_allocation is None:
        raise HTTPException(status_code=404, detail="Allocation not found")
    
    db.delete(db_allocation)
    db.commit()
    return None
