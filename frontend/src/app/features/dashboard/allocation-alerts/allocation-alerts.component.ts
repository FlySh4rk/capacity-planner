import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AllocationService } from '../../../core/services/allocation.service';
import { EndingAllocation } from '../../../core/models/allocation.model';

@Component({
  selector: 'app-allocation-alerts',
  templateUrl: './allocation-alerts.component.html',
  styleUrls: ['./allocation-alerts.component.scss']
})
export class AllocationAlertsComponent implements OnInit, OnChanges {
  @Input() daysAhead = 14;
  
  loading = true;
  errorMessage: string | null = null;
  endingAllocations: EndingAllocation[] = [];

  constructor(private allocationService: AllocationService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['daysAhead']) {
      this.loadAlerts();
    }
  }

  loadAlerts(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.allocationService.getEndingAllocations(this.daysAhead).subscribe(
      (data: EndingAllocation[]) => {
        // Sort by days remaining (ascending)
        this.endingAllocations = data.sort((a, b) => a.days_remaining - b.days_remaining);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load allocation alerts';
        this.loading = false;
        console.error('Error loading allocation alerts:', error);
      }
    );
  }

  getAlertSeverityClass(allocation: EndingAllocation): string {
    if (allocation.days_remaining <= 3) {
      return 'high';
    } else if (allocation.days_remaining <= 7) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  getAlertIcon(allocation: EndingAllocation): string {
    if (allocation.days_remaining <= 3) {
      return 'warning';
    } else if (allocation.days_remaining <= 7) {
      return 'alarm';
    } else {
      return 'info';
    }
  }
}
