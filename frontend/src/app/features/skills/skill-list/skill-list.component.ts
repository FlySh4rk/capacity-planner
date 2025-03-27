import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Skill } from '../../../core/models/skill.model';
import { SkillService } from '../../../core/services/skill.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { SkillFormDialogComponent } from '../skill-form-dialog/skill-form-dialog.component';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'actions'];
  dataSource = new MatTableDataSource<Skill>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private skillService: SkillService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSkills() {
    this.isLoading = true;
    this.skillService.getSkills().subscribe(
      (skills) => {
        this.dataSource.data = skills;
        this.isLoading = false;
      },
      (error) => {
        this.snackBar.open('Error loading skills', 'Close', { duration: 3000 });
        console.error('Error loading skills:', error);
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

  addSkill() {
    const dialogRef = this.dialog.open(SkillFormDialogComponent, {
      width: '500px',
      data: { skill: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.skillService.createSkill(result).subscribe(
          () => {
            this.snackBar.open('Skill created successfully', 'Close', { duration: 3000 });
            this.loadSkills();
          },
          (error) => {
            this.snackBar.open('Error creating skill', 'Close', { duration: 3000 });
            console.error('Error creating skill:', error);
          }
        );
      }
    });
  }

  editSkill(skill: Skill) {
    const dialogRef = this.dialog.open(SkillFormDialogComponent, {
      width: '500px',
      data: { skill: { ...skill } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && skill.id) {
        this.skillService.updateSkill(skill.id, result).subscribe(
          () => {
            this.snackBar.open('Skill updated successfully', 'Close', { duration: 3000 });
            this.loadSkills();
          },
          (error) => {
            this.snackBar.open('Error updating skill', 'Close', { duration: 3000 });
            console.error('Error updating skill:', error);
          }
        );
      }
    });
  }

  deleteSkill(skill: Skill) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the skill "${skill.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && skill.id) {
        this.skillService.deleteSkill(skill.id).subscribe(
          () => {
            this.snackBar.open('Skill deleted successfully', 'Close', { duration: 3000 });
            this.loadSkills();
          },
          (error) => {
            this.snackBar.open('Error deleting skill', 'Close', { duration: 3000 });
            console.error('Error deleting skill:', error);
          }
        );
      }
    });
  }
}
