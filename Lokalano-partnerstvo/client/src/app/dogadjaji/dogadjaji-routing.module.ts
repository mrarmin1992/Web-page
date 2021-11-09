import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogadjajiComponent } from './dogadjaji.component';
import { RouterModule, Routes } from '@angular/router';
import { DogadjajDetailsComponent } from './dogadjaj-details/dogadjaj-details.component';

const routes: Routes = [
  {path: '', component: DogadjajiComponent, data: {breadcrumb: 'Događaji'}},
  {path: ':id', component: DogadjajDetailsComponent, data: {breadcrumb: {alias: 'dogadjajDetails'}}},
];

@NgModule({
  declarations: [],
  imports: [
   CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DogadjajiRoutingModule { }
