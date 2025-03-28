from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AllocationBase(BaseModel):
    developer_id: int
    project_id: int
    start_date: datetime
    end_date: datetime
    allocation_percentage: float = 100.0

class AllocationCreate(AllocationBase):
    pass

class AllocationUpdate(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    allocation_percentage: Optional[float] = None

class AllocationResponse(AllocationBase):
    id: int
    developer_name: str
    project_name: str

    class Config:
        from_attributes = True
