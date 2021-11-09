import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { VijestiDashboardComponent } from './Vijesti/vijesti-dashboard/vijesti-dashboard.component';
import { EditVijestComponent } from './Vijesti/edit-vijest/edit-vijest.component';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { KorisniciComponent } from './Korisnici/korisnici.component';
import { NoviKorisnikComponent } from './Korisnici/novi-korisnik/novi-korisnik.component';
import { AdminCnahgePwComponent } from './Korisnici/admin-cnahge-pw/admin-cnahge-pw.component';
import { EditKursComponent } from './Kursevi/edit-kurs/edit-kurs.component';
import { KursDashboardComponent } from './Kursevi/kurs-dashboard/kurs-dashboard.component';
import { EditDogadjajComponent } from './Dogadjaji/edit-dogadjaj/edit-dogadjaj.component';
import { DogadjajiDashboardComponent } from './Dogadjaji/dogadjaji-dashboard/dogadjaji-dashboard.component';
import { ObukeDashboardComponent } from './Obuke/obuke-dashboard/obuke-dashboard.component';
import { EditObukaComponent } from './Obuke/edit-obuka/edit-obuka.component';
import { LoggedResetPasswordComponent } from './logged-reset-password/logged-reset-password.component';
import { PrijaveDashboardComponent } from './Prijave/prijave-dashboard/prijave-dashboard.component';
import { PrijavaDashboardComponent } from './Prijave/prijava-dashboard/prijava-dashboard.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PublikacijeDashboardComponent } from './Publikacije/publikacije-dashboard/publikacije-dashboard.component';
import { EditPublikacijeComponent } from './Publikacije/edit-publikacije/edit-publikacije.component';
import { KorisnikComponent } from './Korisnici/korisnik/korisnik.component';
import { IndexComponent } from './index.component';



@NgModule({
  declarations: [
    AdminComponent,
    VijestiDashboardComponent,
    EditVijestComponent,
    EditKursComponent,
    KursDashboardComponent,
    KorisniciComponent,
    NoviKorisnikComponent,
    AdminCnahgePwComponent,
    EditDogadjajComponent,
    DogadjajiDashboardComponent,
    ObukeDashboardComponent,
    EditObukaComponent,
    DogadjajiDashboardComponent,
    EditDogadjajComponent,
    LoggedResetPasswordComponent,
    PrijaveDashboardComponent,
    PrijavaDashboardComponent,
    PublikacijeDashboardComponent,
    EditPublikacijeComponent,
    KorisnikComponent,
    IndexComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    FormsModule,
    RichTextEditorModule,
    AccordionModule.forRoot(),
  ]
})
export class AdminModule { }
