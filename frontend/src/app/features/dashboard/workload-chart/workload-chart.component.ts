import { Component, OnInit } from '@angular/core';
import { DeveloperService } from '../../../core/services/developer.service';
import { DeveloperWorkload } from '../../../core/models/developer.model';
import { Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-workload-chart',
  templateUrl: './workload-chart.component.html',
  styleUrls: ['./workload-chart.component.scss']
})
export class WorkloadChartComponent implements OnInit {
  loading = true;
  errorMessage: string | null = null;
  workloadData: any[] = [];
  
  // Chart options
  colorScheme: string | Color = 'cool';
  customColors: any[] = [];

  constructor(private developerService: DeveloperService) {}

  ngOnInit(): void {
    this.loadWorkloadData();
  }

  loadWorkloadData(): void {
    this.developerService.getDeveloperWorkload().subscribe(
      (data: DeveloperWorkload[]) => {
        this.processWorkloadData(data);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load workload data';
        this.loading = false;
        console.error('Error loading workload data:', error);
      }
    );
  }

  processWorkloadData(workloadData: DeveloperWorkload[]): void {
    // Sort by total allocation in descending order
    const sortedData = [...workloadData].sort((a, b) => b.total_allocation - a.total_allocation);
    
    // Take top 15 developers for readability
    const topDevelopers = sortedData.slice(0, 15);
    
    this.workloadData = topDevelopers.map(dev => ({
      name: dev.name,
      value: dev.total_allocation || 0
    }));
    
    // Set custom colors based on allocation percentage
    this.customColors = this.workloadData.map(item => {
      let color = '#4caf50'; // Green for normal allocation
      
      if (item.value > 100) {
        color = '#f44336'; // Red for overallocation
      } else if (item.value > 90) {
        color = '#ff9800'; // Orange for high allocation
      } else if (item.value < 50) {
        color = '#2196f3'; // Blue for low allocation
      }
      
      return {
        name: item.name,
        value: color
      };
    });
  }
}
