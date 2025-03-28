from pydantic import BaseModel, EmailStr
from typing import Optional, List

class ProjectManagerBase(BaseModel):
    name: str
    email: EmailStr

class ProjectManagerCreate(ProjectManagerBase):
    pass

class ProjectManagerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class ProjectManagerResponse(ProjectManagerBase):
    id: int

    class Config:
        orm_mode = True
