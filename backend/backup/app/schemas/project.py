from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    description: str
    start_date: datetime
    end_date: Optional[datetime] = None
    is_active: bool = True

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        orm_mode = True
