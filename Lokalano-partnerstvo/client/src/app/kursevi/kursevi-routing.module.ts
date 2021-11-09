import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KursDetailsComponent } from './kurs-details/kurs-details.component';
import { KurseviComponent } from './kursevi.component';


const routes: Routes = [
  {path: '', component: KurseviComponent, data: {breadcrumb: 'Kursevi'}},
  {path: ':id', component: KursDetailsComponent, data: {breadcrumb: {alias: 'kursDetails'}}},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class KurseviRoutingModule { }
