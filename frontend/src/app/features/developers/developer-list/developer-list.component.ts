import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Developer } from '../../../core/models/developer.model';
import { DeveloperService } from '../../../core/services/developer.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-developer-list',
  templateUrl: './developer-list.component.html',
  styleUrls: ['./developer-list.component.scss']
})
export class DeveloperListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<Developer>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private developerService: DeveloperService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDevelopers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDevelopers() {
    this.isLoading = true;
    this.developerService.getDevelopers().subscribe(
      (developers) => {
        this.dataSource.data = developers;
        this.isLoading = false;
      },
      (error) => {
        this.snackBar.open('Error loading developers', 'Close', { duration: 3000 });
        console.error('Error loading developers:', error);
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

  addDeveloper() {
    this.router.navigate(['/developers/new']);
  }

  viewDeveloper(developer: Developer) {
    this.router.navigate(['/developers', developer.id]);
  }

  editDeveloper(developer: Developer) {
    this.router.navigate(['/developers', developer.id, 'edit']);
  }

  deleteDeveloper(developer: Developer) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${developer.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && developer.id) {
        this.developerService.deleteDeveloper(developer.id).subscribe(
          () => {
            this.snackBar.open('Developer deleted successfully', 'Close', { duration: 3000 });
            this.loadDevelopers();
          },
          (error) => {
            this.snackBar.open('Error deleting developer', 'Close', { duration: 3000 });
            console.error('Error deleting developer:', error);
          }
        );
      }
    });
  }
}
