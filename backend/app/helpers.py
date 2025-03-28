from app.models.project import Project
from sqlalchemy.orm import Session

def add_project_names_to_developer(developer, db: Session):
    """Aggiunge project_name a tutte le allocazioni di un developer"""
    for allocation in getattr(developer, "allocations", []):
        if not hasattr(allocation, "project_name") or not allocation.project_name:
            project = db.query(Project).filter(Project.id == allocation.project_id).first()
            if project:
                setattr(allocation, "project_name", project.name)
    return developer
