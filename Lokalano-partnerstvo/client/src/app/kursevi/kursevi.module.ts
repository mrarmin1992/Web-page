import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KurseviComponent } from './kursevi.component';
import { KursComponent } from './kurs/kurs.component';
import { KursDetailsComponent } from './kurs-details/kurs-details.component';
import { SharedModule } from '../shared/shared.module';
import { KurseviRoutingModule } from './kursevi-routing.module';



@NgModule({
  declarations: [
    KurseviComponent,
    KursComponent,
    KursDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    KurseviRoutingModule
  ]
})
export class KurseviModule { }
