import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;
  isEditMode = false;
  projectId?: number;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Check if we are in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.projectId = +params['id'];
        this.loadProject(this.projectId);
      }
    });
  }

  initForm(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: [new Date(), Validators.required],
      end_date: [null],
      is_active: [true]
    });
  }

  loadProject(id: number): void {
    this.isLoading = true;
    this.projectService.getProject(id).subscribe(
      (project) => {
        // Format dates for the form
        const formattedProject = {
          ...project,
          start_date: project.start_date ? new Date(project.start_date) : null,
          end_date: project.end_date ? new Date(project.end_date) : null
        };
        
        this.projectForm.patchValue(formattedProject);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error loading project', 'Close', { duration: 3000 });
        console.error('Error loading project:', error);
        this.router.navigate(['/projects']);
      }
    );
  }

  submitForm(): void {
    if (this.projectForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const projectData: Project = this.projectForm.value;

    if (this.isEditMode && this.projectId) {
      // Update existing project
      this.projectService.updateProject(this.projectId, projectData).subscribe(
        () => {
          this.isSubmitting = false;
          this.snackBar.open('Project updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/projects']);
        },
        (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Error updating project', 'Close', { duration: 3000 });
          console.error('Error updating project:', error);
        }
      );
    } else {
      // Create new project
      this.projectService.createProject(projectData).subscribe(
        () => {
          this.isSubmitting = false;
          this.snackBar.open('Project created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/projects']);
        },
        (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Error creating project', 'Close', { duration: 3000 });
          console.error('Error creating project:', error);
        }
      );
    }
  }

  resetForm(): void {
    if (this.isEditMode && this.projectId) {
      this.loadProject(this.projectId);
    } else {
      this.projectForm.reset({
        start_date: new Date(),
        is_active: true
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
