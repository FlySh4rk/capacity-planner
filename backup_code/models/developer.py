from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

# Association table for many-to-many relationship between developers and skills
developer_skill = Table('developer_skill', Base.metadata,
    Column('developer_id', Integer, ForeignKey('developers.id'), primary_key=True),
    Column('skill_id', Integer, ForeignKey('skills.id'), primary_key=True)
)

class Developer(Base):
    __tablename__ = "developers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String)
    
    # Relationships
    skills = relationship("Skill", secondary=developer_skill, back_populates="developers")
    allocations = relationship("Allocation", back_populates="developer")
