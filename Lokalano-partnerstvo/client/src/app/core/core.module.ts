import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { SharedModule } from '../shared/shared.module';
import { SectionHeaderComponent } from './section-header/section-header.component';
import {BreadcrumbModule} from 'xng-breadcrumb';
import { ToastrModule } from 'ngx-toastr';
import { SectionNewsComponent } from './section-news/section-news.component';
import { SectionKurseviComponent } from './section-kursevi/section-kursevi.component';
import { SectionSvevijestiComponent } from './section-svevijesti/section-svevijesti.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { KurseviComponent } from './kursevi/kursevi.component';
import { HeaderComponent } from './header/header.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';






@NgModule({
  declarations: [
    NavbarComponent,
    NotFoundComponent,
    ServerErrorComponent,
    SectionHeaderComponent,
    SectionNewsComponent,
    SectionKurseviComponent,
    SectionSvevijestiComponent,
    AboutusComponent,
    KurseviComponent,
    HeaderComponent,
    ContactUsComponent,
    FooterComponent,




  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    BreadcrumbModule,
    ToastrModule.forRoot({
      positionClass : 'toast-bottom-right'
    }),
    SharedModule

  ],
  exports: [
    NavbarComponent,
    NotFoundComponent,
    ServerErrorComponent,
    SectionHeaderComponent,
    SectionNewsComponent,
    SectionKurseviComponent,
    SectionSvevijestiComponent,
    AboutusComponent,
    KurseviComponent,
    HeaderComponent,
    ContactUsComponent,
    FooterComponent,
  ],
})
export class CoreModule { }
