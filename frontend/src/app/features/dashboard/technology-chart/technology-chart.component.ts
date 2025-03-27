import { Component, OnInit } from '@angular/core';
import { SkillService } from '../../../core/services/skill.service';
import { TechnologyUsage } from '../../../core/models/skill.model';
import { Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-technology-chart',
  templateUrl: './technology-chart.component.html',
  styleUrls: ['./technology-chart.component.scss']
})
export class TechnologyChartComponent implements OnInit {
  loading = true;
  errorMessage: string | null = null;
  technologyData: any[] = [];
  currentChartType = 'pie'; // Default chart type
  
  // Chart options
  colorScheme: string | Color = 'cool';

  constructor(private skillService: SkillService) {}

  ngOnInit(): void {
    this.loadTechnologyData();
  }

  loadTechnologyData(): void {
    this.skillService.getTechnologyUsage().subscribe(
      (data: TechnologyUsage[]) => {
        this.processTechnologyData(data);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load technology data';
        this.loading = false;
        console.error('Error loading technology data:', error);
      }
    );
  }

  processTechnologyData(technologyData: TechnologyUsage[]): void {
    // Sort by developer count in descending order
    const sortedData = [...technologyData].sort((a, b) => b.developer_count - a.developer_count);
    
    // Take top technologies for readability
    const topTechnologies = sortedData.slice(0, 10);
    
    this.technologyData = topTechnologies.map(tech => ({
      name: tech.name,
      value: tech.developer_count
    }));
  }

  onChartTypeChange(chartType: string): void {
    this.currentChartType = chartType;
  }
}
