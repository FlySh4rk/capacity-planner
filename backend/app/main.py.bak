from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.database import Base, engine
from app.routers.skills import router as skills_router
from app.routers.developers import router as developers_router
from app.routers.projects import router as projects_router
from app.routers.allocations import router as allocations_router
from app.routers.reports import router as reports_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Capacity Planning API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(skills_router)
app.include_router(developers_router)
app.include_router(projects_router)
app.include_router(allocations_router)
app.include_router(reports_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Capacity Planning API"}

# Debug endpoint to show all registered routes
@app.get("/debug/routes")
def get_routes():
    routes = []
    for route in app.routes:
        routes.append({
            "path": route.path,
            "name": route.name,
            "methods": route.methods if hasattr(route, "methods") else None
        })
    return {"routes": routes}

# Debug middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"DEBUG: Request received: {request.method} {request.url.path}")
    response = await call_next(request)
    print(f"DEBUG: Response: {response.status_code}")
    return response

# run the application
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)
