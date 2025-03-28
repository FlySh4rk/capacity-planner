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
