from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AllocationBase(BaseModel):
    developer_id: int
    project_id: int
    pm_id: Optional[int] = None
    start_date: datetime
    end_date: datetime
    allocation_percentage: float = 100.0
    status: Optional[str] = "IDLE"
    notes: Optional[str] = None

class AllocationCreate(AllocationBase):
    pass

class AllocationUpdate(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    allocation_percentage: Optional[float] = None
    pm_id: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class AllocationResponse(AllocationBase):
    id: int
    developer_name: str
    project_name: str
    pm_name: Optional[str] = None

    class Config:
        orm_mode = True
