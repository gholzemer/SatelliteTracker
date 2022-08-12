import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { SatDetailLayoutComponent } from './sat-detail-layout/sat-detail-layout.component';
import { EditCriteriaLayoutComponent } from './edit-criteria-layout/edit-criteria-layout.component';
import { ManualOverrideComponent } from './edit-criteria-layout/manual-override/manual-override.component';
import { ManualUpdateLayoutComponent } from './manual-update-layout/manual-update-layout.component';

const routes: Routes = [
  // { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: 'Home', component: HomeLayoutComponent },
  { path: 'Satellite-Details', component: SatDetailLayoutComponent },
  { path: 'Validate', component: EditCriteriaLayoutComponent },
  { path: 'ManualUpdate', component: ManualUpdateLayoutComponent },
  { path: 'EditCriteria/:ID', component: ManualOverrideComponent},
  { path: '', redirectTo: '/Validate', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
