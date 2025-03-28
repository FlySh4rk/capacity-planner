from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class SkillBase(BaseModel):
    id: int
    name: str

class DeveloperBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class DeveloperCreate(DeveloperBase):
    skill_ids: List[int] = []

class DeveloperUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    skill_ids: Optional[List[int]] = None

class AllocationInfo(BaseModel):
    id: int
    project_id: int
    project_name: str = ""
    start_date: datetime
    end_date: datetime
    allocation_percentage: float

    class Config:
        from_attributes = True

class DeveloperResponse(DeveloperBase):
    id: int
    skills: List[SkillBase] = []
    allocations: List[AllocationInfo] = []

    class Config:
        from_attributes = True
