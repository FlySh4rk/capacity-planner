import { Component, OnInit } from '@angular/core';
import { DeveloperService } from '../../../core/services/developer.service';
import { DeveloperAvailability } from '../../../core/models/allocation.model';

@Component({
  selector: 'app-developer-availability',
  templateUrl: './developer-availability.component.html',
  styleUrls: ['./developer-availability.component.scss']
})
export class DeveloperAvailabilityComponent implements OnInit {
  loading = true;
  errorMessage: string | null = null;
  availabilityData: DeveloperAvailability[] = [];
  selectedPeriod = '1m'; // Default: 1 month

  constructor(private developerService: DeveloperService) {}

  ngOnInit(): void {
    this.loadAvailabilityData();
  }

  loadAvailabilityData(): void {
    this.loading = true;
    this.errorMessage = null;

    // Calculate dates based on selected period
    const startDate = new Date();
    const endDate = new Date();
    
    switch (this.selectedPeriod) {
      case '1w':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case '2w':
        endDate.setDate(endDate.getDate() + 14);
        break;
      case '1m':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case '3m':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
    }
    
    this.developerService.getDeveloperAvailability(startDate, endDate).subscribe(
      (data: DeveloperAvailability[]) => {
        // Sort by availability (descending)
        this.availabilityData = data.sort((a, b) => b.available_percentage - a.available_percentage);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load availability data';
        this.loading = false;
        console.error('Error loading availability data:', error);
      }
    );
  }

  onPeriodChange(): void {
    this.loadAvailabilityData();
  }

  getAvailabilityClass(availablePercentage: number): string {
    if (availablePercentage >= 50) {
      return 'high-availability';
    } else if (availablePercentage >= 20) {
      return 'medium-availability';
    } else {
      return 'low-availability';
    }
  }
}
