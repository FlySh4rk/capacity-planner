from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy import func

from app.database import get_db
from app.models.developer import Developer
from app.models.project import Project
from app.models.allocation import Allocation
from app.models.skill import Skill

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/developer-workload")
def get_developer_workload(db: Session = Depends(get_db)):
    """Get workload for each developer based on current allocations."""
    
    current_date = datetime.utcnow()
    
    # Get all active developers with their allocations
    query = db.query(
        Developer.id, 
        Developer.name,
        func.sum(Allocation.allocation_percentage).label("total_allocation")
    ).join(
        Allocation, 
        (Developer.id == Allocation.developer_id) & 
        (Allocation.start_date <= current_date) & 
        (Allocation.end_date >= current_date)
    ).group_by(
        Developer.id, 
        Developer.name
    ).all()
    
    # Format response
    result = []
    for developer_id, name, total_allocation in query:
        result.append({
            "developer_id": developer_id,
            "name": name,
            "total_allocation": total_allocation or 0  # Handle None case for developers with no active allocations
        })
    
    # Add developers with no allocations
    all_developers = db.query(Developer.id, Developer.name).all()
    developer_ids_with_allocations = [d["developer_id"] for d in result]
    
    for developer_id, name in all_developers:
        if developer_id not in developer_ids_with_allocations:
            result.append({
                "developer_id": developer_id,
                "name": name,
                "total_allocation": 0
            })
    
    return result

@router.get("/technology-usage")
def get_technology_usage(db: Session = Depends(get_db)):
    """Get count of developers by skill/technology."""
    
    # Count developers by skill
    query = db.query(
        Skill.id,
        Skill.name,
        Skill.category,
        func.count(Developer.id).label("developer_count")
    ).join(
        Skill.developers
    ).group_by(
        Skill.id,
        Skill.name,
        Skill.category
    ).all()
    
    # Format response
    result = []
    for skill_id, name, category, developer_count in query:
        result.append({
            "skill_id": skill_id,
            "name": name,
            "category": category,
            "developer_count": developer_count
        })
    
    return result

@router.get("/ending-allocations")
def get_ending_allocations(days_ahead: int = Query(14, description="Number of days to look ahead"), db: Session = Depends(get_db)):
    """Get allocations ending within the specified number of days."""
    
    current_date = datetime.utcnow()
    end_date = current_date + timedelta(days=days_ahead)
    
    # Get allocations ending within the time window
    query = db.query(
        Allocation,
        Developer.name.label("developer_name"),
        Project.name.label("project_name")
    ).join(
        Developer, Allocation.developer_id == Developer.id
    ).join(
        Project, Allocation.project_id == Project.id
    ).filter(
        Allocation.end_date.between(current_date, end_date)
    ).all()
    
    # Format response
    result = []
    for allocation, developer_name, project_name in query:
        days_remaining = (allocation.end_date - current_date).days
        
        result.append({
            "allocation_id": allocation.id,
            "developer_id": allocation.developer_id,
            "developer_name": developer_name,
            "project_id": allocation.project_id,
            "project_name": project_name,
            "end_date": allocation.end_date,
            "days_remaining": days_remaining,
            "allocation_percentage": allocation.allocation_percentage
        })
    
    return result

@router.get("/developer-availability")
def get_developer_availability(
    start_date: datetime = None, 
    end_date: datetime = None,
    db: Session = Depends(get_db)
):
    """Get developer availability in a specific date range."""
    
    if not start_date:
        start_date = datetime.utcnow()
    if not end_date:
        end_date = start_date + timedelta(days=30)  # Default to 30 days ahead
    
    # Get all developers
    developers = db.query(Developer).all()
    
    result = []
    for developer in developers:
        # Get allocations in the date range
        allocations = db.query(
            func.sum(Allocation.allocation_percentage).label("total_allocation")
        ).filter(
            Allocation.developer_id == developer.id,
            Allocation.start_date <= end_date,
            Allocation.end_date >= start_date
        ).scalar() or 0
        
        available_percentage = max(0, 100 - allocations)
        
        result.append({
            "developer_id": developer.id,
            "name": developer.name,
            "allocated_percentage": allocations,
            "available_percentage": available_percentage
        })
    
    return result
