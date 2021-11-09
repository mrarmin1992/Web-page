import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublikacijeComponent } from './publikacije.component';
import { PublikacijeRoutingModule } from './publikacije-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';

const routes: Routes = [
  {path: '', component: PublikacijeComponent, data: {breadcrumb: 'Publikacije'}}
];

@NgModule({
  declarations: [
    PublikacijeComponent
  ],
  imports: [
    CommonModule,
    PublikacijeRoutingModule,
    RouterModule.forChild(routes),
    AccordionModule.forRoot(),
  ],
  exports: [RouterModule]
})
export class PublikacijeModule { }
