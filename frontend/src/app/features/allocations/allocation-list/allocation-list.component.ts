import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { AllocationService } from '../../../core/services/allocation.service';
import { Allocation } from '../../../core/models/allocation.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-allocation-list',
  templateUrl: './allocation-list.component.html',
  styleUrls: ['./allocation-list.component.scss']
})
export class AllocationListComponent implements OnInit {
  displayedColumns: string[] = ['developer', 'project', 'startDate', 'endDate', 'percentage', 'status', 'actions'];
  dataSource = new MatTableDataSource<Allocation>([]);
  allAllocations: Allocation[] = [];
  currentStatusFilter = 'all';
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private allocationService: AllocationService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllocations();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAllocations() {
    this.isLoading = true;
    this.allocationService.getAllocations().subscribe(
      (allocations) => {
        this.allAllocations = allocations;
        this.applyStatusFilter(this.currentStatusFilter);
        this.isLoading = false;
      },
      (error) => {
        this.snackBar.open('Error loading allocations', 'Close', { duration: 3000 });
        console.error('Error loading allocations:', error);
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

  filterByStatus(event: MatSelectChange) {
    this.currentStatusFilter = event.value;
    this.applyStatusFilter(event.value);
  }

  applyStatusFilter(statusFilter: string) {
    const now = new Date();
    
    let filteredAllocations: Allocation[] = [];
    
    switch (statusFilter) {
      case 'current':
        filteredAllocations = this.allAllocations.filter(allocation => {
          const startDate = new Date(allocation.start_date);
          const endDate = new Date(allocation.end_date);
          return startDate <= now && endDate >= now;
        });
        break;
      case 'future':
        filteredAllocations = this.allAllocations.filter(allocation => {
          const startDate = new Date(allocation.start_date);
          return startDate > now;
        });
        break;
      case 'past':
        filteredAllocations = this.allAllocations.filter(allocation => {
          const endDate = new Date(allocation.end_date);
          return endDate < now;
        });
        break;
      default:
        filteredAllocations = [...this.allAllocations];
        break;
    }
    
    this.dataSource.data = filteredAllocations;
  }

  getAllocationStatus(allocation: Allocation): string {
    const now = new Date();
    const startDate = new Date(allocation.start_date);
    const endDate = new Date(allocation.end_date);
    
    if (startDate <= now && endDate >= now) {
      return 'Current';
    } else if (startDate > now) {
      return 'Future';
    } else {
      return 'Past';
    }
  }

  getAllocationStatusClass(allocation: Allocation): string {
    const status = this.getAllocationStatus(allocation);
    return `status-${status.toLowerCase()}`;
  }

  addAllocation() {
    this.router.navigate(['/allocations/new']);
  }

  editAllocation(allocation: Allocation) {
    if (allocation.id) {
      this.router.navigate(['/allocations', allocation.id, 'edit']);
    }
  }

  deleteAllocation(allocation: Allocation) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete this allocation?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && allocation.id) {
        this.allocationService.deleteAllocation(allocation.id).subscribe(
          () => {
            this.snackBar.open('Allocation deleted successfully', 'Close', { duration: 3000 });
            this.loadAllocations();
          },
          (error) => {
            this.snackBar.open('Error deleting allocation', 'Close', { duration: 3000 });
            console.error('Error deleting allocation:', error);
          }
        );
      }
    });
  }
}
