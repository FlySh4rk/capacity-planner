#!/usr/bin/env python3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Capacity Planning API Minimal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Capacity Planning API Minimal"}

@app.get("/skills")
def get_skills():
    return [{"id": 1, "name": "Python", "category": "Programming"}]

@app.get("/developers")
def get_developers():
    return [{"id": 1, "name": "John Doe", "email": "john@example.com", "role": "Developer"}]

@app.get("/projects")
def get_projects():
    return [{"id": 1, "name": "Project 1", "description": "Test project", "start_date": "2025-01-01", "end_date": "2025-12-31", "is_active": True}]

@app.get("/allocations")
def get_allocations():
    return [{"id": 1, "developer_id": 1, "project_id": 1, "developer_name": "John Doe", "project_name": "Project 1", "start_date": "2025-01-01", "end_date": "2025-06-30", "allocation_percentage": 100}]

@app.get("/reports/developer-workload")
def get_developer_workload():
    return [{"developer_id": 1, "name": "John Doe", "total_allocation": 100}]

@app.get("/reports/technology-usage")
def get_technology_usage():
    return [{"skill_id": 1, "name": "Python", "category": "Programming", "developer_count": 1}]

@app.get("/reports/ending-allocations")
def get_ending_allocations():
    return [{"allocation_id": 1, "developer_id": 1, "developer_name": "John Doe", "project_id": 1, "project_name": "Project 1", "end_date": "2025-06-30", "days_remaining": 10, "allocation_percentage": 100}]

@app.get("/reports/developer-availability")
def get_developer_availability():
    return [{"developer_id": 1, "name": "John Doe", "allocated_percentage": 100, "available_percentage": 0}]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
