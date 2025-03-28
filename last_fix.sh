#!/bin/bash

# Exit on any error
set -e

# Determine the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    echo -e "${GREEN}[✓] $1${NC}"
}

# Function to log warnings
warn() {
    echo -e "${YELLOW}[!] $1${NC}"
}

# Backend Updates
update_backend() {
    log "Updating Backend Project Manager Components"

    # Ensure directories exist
    mkdir -p "$SCRIPT_DIR/backend/app/models"
    mkdir -p "$SCRIPT_DIR/backend/app/schemas"
    mkdir -p "$SCRIPT_DIR/backend/app/routers"

    # Project Manager Model
    cat > "$SCRIPT_DIR/backend/app/models/project_manager.py" << 'EOL'
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class ProjectManager(Base):
    __tablename__ = "project_managers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    
    # Relationships
    allocations = relationship("Allocation", back_populates="project_manager")
EOL

    # Project Manager Schema
    cat > "$SCRIPT_DIR/backend/app/schemas/project_manager.py" << 'EOL'
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
EOL

    # Project Manager Router
    cat > "$SCRIPT_DIR/backend/app/routers/project_managers.py" << 'EOL'
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.project_manager import ProjectManager
from app.schemas.project_manager import ProjectManagerCreate, ProjectManagerUpdate, ProjectManagerResponse

router = APIRouter(prefix="/project-managers", tags=["project-managers"])

@router.post("/", response_model=ProjectManagerResponse, status_code=status.HTTP_201_CREATED)
def create_project_manager(project_manager: ProjectManagerCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_pm = db.query(ProjectManager).filter(ProjectManager.email == project_manager.email).first()
    if existing_pm:
        raise HTTPException(status_code=400, detail="Project Manager with this email already exists")
    
    # Create new project manager
    db_project_manager = ProjectManager(
        name=project_manager.name,
        email=project_manager.email
    )
    
    db.add(db_project_manager)
    db.commit()
    db.refresh(db_project_manager)
    
    return db_project_manager

@router.get("/", response_model=List[ProjectManagerResponse])
def get_project_managers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    project_managers = db.query(ProjectManager).offset(skip).limit(limit).all()
    return project_managers

@router.get("/{project_manager_id}", response_model=ProjectManagerResponse)
def get_project_manager(project_manager_id: int, db: Session = Depends(get_db)):
    project_manager = db.query(ProjectManager).filter(ProjectManager.id == project_manager_id).first()
    if project_manager is None:
        raise HTTPException(status_code=404, detail="Project Manager not found")
    return project_manager

@router.put("/{project_manager_id}", response_model=ProjectManagerResponse)
def update_project_manager(
    project_manager_id: int, 
    project_manager_update: ProjectManagerUpdate, 
    db: Session = Depends(get_db)
):
    # Find existing project manager
    db_project_manager = db.query(ProjectManager).filter(ProjectManager.id == project_manager_id).first()
    if db_project_manager is None:
        raise HTTPException(status_code=404, detail="Project Manager not found")
    
    # Update fields if provided
    if project_manager_update.name is not None:
        db_project_manager.name = project_manager_update.name
    
    if project_manager_update.email is not None:
        # Check if new email is already in use
        existing_pm = db.query(ProjectManager).filter(
            ProjectManager.email == project_manager_update.email,
            ProjectManager.id != project_manager_id
        ).first()
        
        if existing_pm:
            raise HTTPException(status_code=400, detail="Email already in use by another Project Manager")
        
        db_project_manager.email = project_manager_update.email
    
    db.commit()
    db.refresh(db_project_manager)
    
    return db_project_manager

@router.delete("/{project_manager_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_manager(project_manager_id: int, db: Session = Depends(get_db)):
    # Find existing project manager
    db_project_manager = db.query(ProjectManager).filter(ProjectManager.id == project_manager_id).first()
    if db_project_manager is None:
        raise HTTPException(status_code=404, detail="Project Manager not found")
    
    # Check for existing allocations
    allocations = db.query(ProjectManager).filter(ProjectManager.id == project_manager_id).first().allocations
    if allocations:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete Project Manager with existing allocations"
        )
    
    db.delete(db_project_manager)
    db.commit()
    
    return None
EOL

    # Update model __init__.py
    cat > "$SCRIPT_DIR/backend/app/models/__init__.py" << 'EOL'
# Ensure correct import order
from app.models.developer import Developer, developer_skill
from app.models.skill import Skill
from app.models.project import Project
from app.models.project_manager import ProjectManager
from app.models.allocation import Allocation
EOL

    # Update main.py to include project manager router
    log "Updating main.py to include ProjectManager router"
    sed -i '' '/from app.routers import/a\
from app.routers import project_managers' "$SCRIPT_DIR/backend/app/main.py"
    sed -i '' '/app.include_router(/a\
app.include_router(project_managers.router)' "$SCRIPT_DIR/backend/app/main.py"

    log "Backend Project Manager Components Updated"
}

# Frontend Updates
update_frontend() {
    log "Updating Frontend Project Manager Components"

    # Ensure directories exist
    mkdir -p "$SCRIPT_DIR/frontend/src/app/core/models"
    mkdir -p "$SCRIPT_DIR/frontend/src/app/core/services"
    mkdir -p "$SCRIPT_DIR/frontend/src/app/features/project-managers/project-manager-list"
    mkdir -p "$SCRIPT_DIR/frontend/src/app/features/project-managers/project-manager-form-dialog"

    # Project Manager Model
    cat > "$SCRIPT_DIR/frontend/src/app/core/models/project-manager.model.ts" << 'EOL'
export interface ProjectManager {
  id?: number;
  name: string;
  email: string;
}
EOL

    # Project Manager Service
    cat > "$SCRIPT_DIR/frontend/src/app/core/services/project-manager.service.ts" << 'EOL'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ProjectManager } from '../models/project-manager.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {
  private path = '/project-managers';

  constructor(private apiService: ApiService) { }

  getProjectManagers(): Observable<ProjectManager[]> {
    return this.apiService.get<ProjectManager[]>(this.path);
  }

  getProjectManager(id: number): Observable<ProjectManager> {
    return this.apiService.get<ProjectManager>(`${this.path}/${id}`);
  }

  createProjectManager(projectManager: ProjectManager): Observable<ProjectManager> {
    return this.apiService.post<ProjectManager, ProjectManager>(this.path, projectManager);
  }

  updateProjectManager(id: number, projectManager: Partial<ProjectManager>): Observable<ProjectManager> {
    return this.apiService.put<ProjectManager, Partial<ProjectManager>>(`${this.path}/${id}`, projectManager);
  }

  deleteProjectManager(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}/${id}`);
  }
}
EOL

    # Project Manager List Component
    cat > "$SCRIPT_DIR/frontend/src/app/features/project-managers/project-manager-list/project-manager-list.component.ts" << 'EOL'
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectManager } from '../../../core/models/project-manager.model';
import { ProjectManagerService } from '../../../core/services/project-manager.service';
import { ProjectManagerFormDialogComponent } from '../project-manager-form-dialog/project-manager-form-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-manager-list',
  templateUrl: './project-manager-list.component.html',
  styleUrls: ['./project-manager-list.component.scss']
})
export class ProjectManagerListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'actions'];
  dataSource = new MatTableDataSource<ProjectManager>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectManagerService: ProjectManagerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProjectManagers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProjectManagers() {
    this.isLoading = true;
    this.projectManagerService.getProjectManagers().subscribe(
      (projectManagers) => {
        this.dataSource.data = projectManagers;
        this.isLoading = false;
      },
      (error) => {
        this.snackBar.open('Error loading project managers', 'Close', { duration: 3000 });
        console.error('Error loading project managers:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addProjectManager() {
    const dialogRef = this.dialog.open(ProjectManagerFormDialogComponent, {
      width: '500px',
      data: { projectManager: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectManagerService.createProjectManager(result).subscribe(
          () => {
            this.snackBar.open('Project Manager created successfully', 'Close', { duration: 3000 });
            this.loadProjectManagers();
          },
          (error) => {
            this.snackBar.open('Error creating project manager', 'Close', { duration: 3000 });
            console.error('Error creating project manager:', error);
          }
        );
      }
    });
  }

  editProjectManager(projectManager: ProjectManager) {
    const dialogRef = this.dialog.open(ProjectManagerFormDialogComponent, {
      width: '500px',
      data: { projectManager: { ...projectManager } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && projectManager.id) {
        this.projectManagerService.updateProjectManager(projectManager.id, result).subscribe(
          () => {
            this.snackBar.open('Project Manager updated successfully', 'Close', { duration: 3000 });
            this.loadProjectManagers();
          },
          (error) => {
            this.snackBar.open('Error updating project manager', 'Close', { duration: 3000 });
            console.error('Error updating project manager:', error);
          }
        );
      }
    });
  }

  deleteProjectManager(projectManager: ProjectManager) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the project manager "${projectManager.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && projectManager.id) {
        this.projectManagerService.deleteProjectManager(projectManager.id).subscribe(
          () => {
            this.snackBar.open('Project Manager deleted successfully', 'Close', { duration: 3000 });
            this.loadProjectManagers();
          },
          (error) => {
            this.snackBar.open('Error deleting project manager', 'Close', { duration: 3000 });
            console.error('Error deleting project manager:', error);
          }
        );
      }
    });
  }
}
EOL

    # Project Manager Form Dialog Component
    cat > "$SCRIPT_DIR/frontend/src/app/features/project-managers/project-manager-form-dialog/project-manager-form-dialog.component.ts" << 'EOL'
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectManager } from '../../../core/models/project-manager.model';

interface DialogData {
  projectManager: ProjectManager;
}

@Component({
  selector: 'app-project-manager-form-dialog',
  templateUrl: './project-manager-form-dialog.component.html',
  styleUrls: ['./project-manager-form-dialog.component.scss']
})
export class ProjectManagerFormDialogComponent implements OnInit {
  projectManagerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProjectManagerFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.projectManagerForm = this.formBuilder.group({
      name: [this.data.projectManager.name || '', Validators.required],
      email: [this.data.projectManager.email || '', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.projectManagerForm.valid) {
      this.dialogRef.close(this.projectManagerForm.value);
    }
  }
}
EOL

# Project Manager Form Dialog HTML
    cat > "$SCRIPT_DIR/frontend/src/app/features/project-managers/project-manager-form-dialog/project-manager-form-dialog.component.html" << 'EOL'
<h2 mat-dialog-title>{{ data.projectManager.id ? 'Edit Project Manager' : 'Add Project Manager' }}</h2>

<form [formGroup]="projectManagerForm" (ngSubmit)="onSubmit()">
  <mat-dialog-content>
    <div class="form-row">
      <mat-form-field appearance="outline">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" required>
        <mat-error *ngIf="projectManagerForm.get('name')?.hasError('required')">
          Name is required
        </mat-error>
      </mat-form-field>
    </div>

    <div class="form-row">
      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" required type="email">
        <mat-error *ngIf="projectManagerForm.get('email')?.hasError('required')">
          Email is required
        </mat-error>
        <mat-error *ngIf="projectManagerForm.get('email')?.hasError('email')">
          Please enter a valid email address
        </mat-error>
      </mat-form-field>
    </div>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close>Cancel</button>
    <button mat-raised-button color="primary" type="submit" [disabled]="projectManagerForm.invalid">
      {{ data.projectManager.id ? 'Update' : 'Create' }}
    </button>
  </mat-dialog-actions>
</form>
EOL

    # Project Manager List Component HTML
    cat > "$SCRIPT_DIR/frontend/src/app/features/project-managers/project-manager-list/project-manager-list.component.html" << 'EOL'
<div class="container">
  <div class="header">
    <h1>Project Managers</h1>
    <button mat-raised-button color="primary" (click)="addProjectManager()">
      <mat-icon>add</mat-icon> Add Project Manager
    </button>
  </div>

  <div class="filter-bar">
    <mat-form-field>
      <input matInput (keyup)="applyFilter($event)" placeholder="Filter project managers">
    </mat-form-field>
  </div>

  <div *ngIf="isLoading" class="loading-container">
    <mat-spinner diameter="40"></mat-spinner>
  </div>

  <div class="table-container" *ngIf="!isLoading">
    <table mat-table [dataSource]="dataSource" matSort>
      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let element">{{ element.name }}</td>
      </ng-container>

      <!-- Email Column -->
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
        <td mat-cell *matCellDef="let element">{{ element.email }}</td>
      </ng-container>

      <!-- Actions Column -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button (click)="editProjectManager(element)" matTooltip="Edit">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteProjectManager(element)" matTooltip="Delete">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
  </div>
</div>
EOL

    # Project Manager List Component SCSS
    cat > "$SCRIPT_DIR/frontend/src/app/features/project-managers/project-manager-list/project-manager-list.component.scss" << 'EOL'
.container {
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-bar {
  margin-bottom: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
}

mat-paginator {
  background-color: transparent;
}
EOL

    # Project Managers Module
    cat > "$SCRIPT_DIR/frontend/src/app/features/project-managers/project-managers.module.ts" << 'EOL'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { ProjectManagerListComponent } from './project-manager-list/project-manager-list.component';
import { ProjectManagerFormDialogComponent } from './project-manager-form-dialog/project-manager-form-dialog.component';

const routes: Routes = [
  { path: '', component: ProjectManagerListComponent }
];

@NgModule({
  declarations: [
    ProjectManagerListComponent,
    ProjectManagerFormDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectManagersModule { }
EOL

    # Update App Routing Module
    log "Updating App Routing Module"
    sed -i '' '/projects/a\
  { \n    path: "project-managers", \n    loadChildren: () => import("./features/project-managers/project-managers.module").then(m => m.ProjectManagersModule)\n  },' "$SCRIPT_DIR/frontend/src/app/app-routing.module.ts"

    # Update Sidebar Component HTML
    log "Updating Sidebar Component"
    sed -i '' '/Allocations/a\
    <a mat-list-item routerLink="/project-managers" routerLinkActive="active">\n      <mat-icon>manage_accounts</mat-icon>\n      <span *ngIf="isExpanded">Project Managers</span>\n    </a>' "$SCRIPT_DIR/frontend/src/app/shared/components/sidebar/sidebar.component.html"

    log "Frontend Project Manager Components Updated"
}

# Execute updates
update_backend
update_frontend

# Log migration instructions
log "Integration Complete!"
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Apply database migration:"
echo "   cd backend"
echo "   alembic revision --autogenerate -m 'Add project manager support'"
echo "   alembic upgrade head"
echo ""
echo "2. Restart backend and frontend services"
echo ""
echo "3. Verify new Project Managers functionality in the application"