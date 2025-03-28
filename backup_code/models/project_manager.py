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
