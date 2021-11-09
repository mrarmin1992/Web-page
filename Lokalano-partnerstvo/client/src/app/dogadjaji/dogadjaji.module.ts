import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogadjajiComponent } from './dogadjaji.component';
import { SharedModule } from '../shared/shared.module';
import { DogadjajiRoutingModule } from './dogadjaji-routing.module';
import { DogadjajComponent } from './dogadjaj/dogadjaj.component';
import { DogadjajDetailsComponent } from './dogadjaj-details/dogadjaj-details.component';



@NgModule({
  declarations: [
    DogadjajiComponent,
    DogadjajComponent,
    DogadjajDetailsComponent,


  ],
  imports: [
    CommonModule,
    SharedModule,
    DogadjajiRoutingModule
  ]
})
export class DogadjajiModule { }
