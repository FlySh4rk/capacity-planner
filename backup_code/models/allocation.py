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
