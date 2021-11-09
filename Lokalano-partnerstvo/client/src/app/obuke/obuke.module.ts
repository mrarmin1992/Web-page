import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObukeComponent } from './obuke.component';
import { ObukeItemComponent } from './obuke-item/obuke-item.component';
import { ObukeDetailsComponent } from './obuke-details/obuke-details.component';
import { SharedModule } from '../shared/shared.module';
import { ObukeRoutingModule } from './obuke-routing.module';




@NgModule({
  declarations: [
    ObukeComponent,
    ObukeItemComponent,
    ObukeDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ObukeRoutingModule
  ]
})
export class ObukeModule { }
