import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { 
    path: 'developers', 
    loadChildren: () => import('./features/developers/developers.module').then(m => m.DevelopersModule)
  },
  { 
    path: 'skills', 
    loadChildren: () => import('./features/skills/skills.module').then(m => m.SkillsModule)
  },
  { 
    path: 'projects', 
    loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule)
  },
  { 
    path: 'allocations', 
    loadChildren: () => import('./features/allocations/allocations.module').then(m => m.AllocationsModule)
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
