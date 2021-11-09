import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VijestiComponent } from './vijesti.component';
import { VijestDetailsComponent } from './vijest-details/vijest-details.component';

const routes: Routes = [
  {path: '', component: VijestiComponent, data: {breadcrumb: 'Vijesti'}},
  {path: ':id', component: VijestDetailsComponent, data: {breadcrumb: {alias: 'vijestiDetails'}}},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VijestiRoutingModule { }
