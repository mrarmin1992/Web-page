import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ObukeComponent } from './obuke.component';
import { ObukeDetailsComponent } from './obuke-details/obuke-details.component';

const routes: Routes = [
  {path: '', component: ObukeComponent, data: {breadcrumb: 'Obuke'}},
  {path: ':id', component: ObukeDetailsComponent, data: {breadcrumb: {alias: 'obukaDetails'}}},
];


@NgModule({
  declarations: [],
  imports: [
    // CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ObukeRoutingModule { }
