import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'startDate', 'endDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Project>([]);
  projects: Project[] = [];
  showActiveOnly = true;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProjects() {
    this.isLoading = true;
    this.projectService.getProjects().subscribe(
      (projects) => {
        this.projects = projects;
        this.applyFilters();
        this.isLoading = false;
      },
      (error) => {
        this.snackBar.open('Error loading projects', 'Close', { duration: 3000 });
        console.error('Error loading projects:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilters() {
    let filteredProjects = [...this.projects];
    
    if (this.showActiveOnly) {
      filteredProjects = filteredProjects.filter(project => project.is_active);
    }
    
    this.dataSource.data = filteredProjects;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleActiveFilter(event: MatCheckboxChange) {
    this.showActiveOnly = event.checked;
    this.applyFilters();
  }

  addProject() {
    this.router.navigate(['/projects/new']);
  }

  viewProject(project: Project) {
    this.router.navigate(['/projects', project.id]);
  }

  editProject(project: Project) {
    this.router.navigate(['/projects', project.id, 'edit']);
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the project "${project.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && project.id) {
        this.projectService.deleteProject(project.id).subscribe(
          () => {
            this.snackBar.open('Project deleted successfully', 'Close', { duration: 3000 });
            this.loadProjects();
          },
          (error) => {
            this.snackBar.open('Error deleting project', 'Close', { duration: 3000 });
            console.error('Error deleting project:', error);
          }
        );
      }
    });
  }
}
