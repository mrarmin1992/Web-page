import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { SocialLinksComponent } from './components/social-links/social-links.component';
import { ONamaComponent } from './components/o-nama/o-nama.component';
import { PartnerComponent } from './components/partner/partner.component';
import { TextareaInputComponent } from './components/textarea-input/textarea-input.component';
import { RouterModule } from '@angular/router';
import { KurseviHomeComponent } from './components/kursevi-home/kursevi-home.component';



@NgModule({
  declarations: [
    PagingHeaderComponent,
    PagerComponent,
    AlertDialogComponent,
    ConfirmationDialogComponent,
    TextInputComponent,
    SocialLinksComponent,
    ONamaComponent,
    PartnerComponent,
    TextareaInputComponent,
    KurseviHomeComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    NgxDropzoneModule,
    ImageCropperModule,
    RouterModule

],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagerComponent,
    ReactiveFormsModule,
    BsDropdownModule,
    NgxDropzoneModule,
    ImageCropperModule,
    TextInputComponent,
    SocialLinksComponent,
    TextareaInputComponent,
    PartnerComponent,
    KurseviHomeComponent
  ]
})
export class SharedModule {}
