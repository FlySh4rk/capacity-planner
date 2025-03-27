import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AllocationService } from '../../../core/services/allocation.service';
import { DeveloperService } from '../../../core/services/developer.service';
import { ProjectService } from '../../../core/services/project.service';
import { Allocation } from '../../../core/models/allocation.model';
import { Developer } from '../../../core/models/developer.model';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-allocation-form',
  templateUrl: './allocation-form.component.html',
  styleUrls: ['./allocation-form.component.scss']
})
export class AllocationFormComponent implements OnInit {
  allocationForm!: FormGroup;
  developers: Developer[] = [];
  projects: Project[] = [];
  isEditMode = false;
  allocationId?: number;
  showOverallocationWarning = false;
  isLoading = true;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private allocationService: AllocationService,
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFormData();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.allocationId = +params['id'];
        this.loadAllocation(this.allocationId);
      } else {
        this.isLoading = false;
      }
    });
    
    // Check if we have query params for pre-selecting developer or project
    this.route.queryParams.subscribe(params => {
      if (params['developerId'] && !this.isEditMode) {
        this.allocationForm.get('developer_id')?.setValue(+params['developerId']);
      }
      if (params['projectId'] && !this.isEditMode) {
        this.allocationForm.get('project_id')?.setValue(+params['projectId']);
      }
    });
    
    // Monitor form changes to check for overallocation
    this.allocationForm.valueChanges.subscribe(() => {
      this.checkOverallocation();
    });
  }

  initForm(): void {
    this.allocationForm = this.formBuilder.group({
      developer_id: ['', Validators.required],
      project_id: ['', Validators.required],
      start_date: [new Date(), Validators.required],
      end_date: [new Date(new Date().setMonth(new Date().getMonth() + 1)), Validators.required],
      allocation_percentage: [100, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  loadFormData(): void {
    forkJoin({
      developers: this.developerService.getDevelopers(),
      projects: this.projectService.getProjects()
    }).subscribe(
      result => {
        this.developers = result.developers;
        this.projects = result.projects.filter(p => p.is_active);
      },
      error => {
        this.snackBar.open('Error loading form data', 'Close', { duration: 3000 });
        console.error('Error loading form data:', error);
      }
    );
  }

  loadAllocation(id: number): void {
    this.allocationService.getAllocation(id).subscribe(
      allocation => {
        // Format dates for the form
        const formattedAllocation = {
          ...allocation,
          start_date: new Date(allocation.start_date),
          end_date: new Date(allocation.end_date)
        };
        
        this.allocationForm.patchValue(formattedAllocation);
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.snackBar.open('Error loading allocation', 'Close', { duration: 3000 });
        console.error('Error loading allocation:', error);
        this.router.navigate(['/allocations']);
      }
    );
  }

  checkOverallocation(): void {
    const formValues = this.allocationForm.value;
    if (!formValues.developer_id || !formValues.start_date || !formValues.end_date || !formValues.allocation_percentage) {
      this.showOverallocationWarning = false;
      return;
    }

    const developerId = formValues.developer_id;
    const startDate = new Date(formValues.start_date);
    const endDate = new Date(formValues.end_date);
    const percentage = formValues.allocation_percentage;

    this.allocationService.getAllocations(developerId).subscribe(
      allocations => {
        // Filter out current allocation if in edit mode
        const otherAllocations = this.isEditMode ? 
          allocations.filter(a => a.id !== this.allocationId) : 
          allocations;
        
        // Check for overlapping allocations
        let totalAllocation = 0;
        
        for (const allocation of otherAllocations) {
          const allocStartDate = new Date(allocation.start_date);
          const allocEndDate = new Date(allocation.end_date);
          
          // Check if dates overlap
          if ((startDate <= allocEndDate) && (endDate >= allocStartDate)) {
            totalAllocation += allocation.allocation_percentage;
          }
        }
        
        // Add current allocation percentage
        totalAllocation += percentage;
        
        this.showOverallocationWarning = totalAllocation > 100;
      }
    );
  }

  submitForm(): void {
    if (this.allocationForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const allocationData: Allocation = this.allocationForm.value;

    if (this.isEditMode && this.allocationId) {
      // Update existing allocation
      this.allocationService.updateAllocation(this.allocationId, allocationData).subscribe(
        () => {
          this.isSubmitting = false;
          this.snackBar.open('Allocation updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/allocations']);
        },
        error => {
          this.isSubmitting = false;
          this.snackBar.open('Error updating allocation', 'Close', { duration: 3000 });
          console.error('Error updating allocation:', error);
        }
      );
    } else {
      // Create new allocation
      this.allocationService.createAllocation(allocationData).subscribe(
        () => {
          this.isSubmitting = false;
          this.snackBar.open('Allocation created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/allocations']);
        },
        error => {
          this.isSubmitting = false;
          this.snackBar.open('Error creating allocation', 'Close', { duration: 3000 });
          console.error('Error creating allocation:', error);
        }
      );
    }
  }

  resetForm(): void {
    if (this.isEditMode && this.allocationId) {
      this.loadAllocation(this.allocationId);
    } else {
      this.allocationForm.reset({
        developer_id: '',
        project_id: '',
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        allocation_percentage: 100
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/allocations']);
  }
}
