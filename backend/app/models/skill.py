from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.developer import developer_skill

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String)
    
    # Relationship - relazione bidirezionale
    developers = relationship("Developer", secondary=developer_skill, back_populates="skills")
