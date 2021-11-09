import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VijestiComponent } from './vijesti.component';
import { VijestComponent } from './vijest/vijest.component';
import { SharedModule } from '../shared/shared.module';
import { VijestDetailsComponent } from './vijest-details/vijest-details.component';
import { VijestiRoutingModule } from './vijesti-routing.module';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [
    VijestiComponent,
    VijestComponent,
    VijestDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VijestiRoutingModule,
    CoreModule
  ]
})
export class VijestiModule { }
