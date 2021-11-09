import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminCnahgePwComponent } from './Korisnici/admin-cnahge-pw/admin-cnahge-pw.component';
import { KorisniciComponent } from './Korisnici/korisnici.component';
import { NoviKorisnikComponent } from './Korisnici/novi-korisnik/novi-korisnik.component';
import { DogadjajiDashboardComponent } from './Dogadjaji/dogadjaji-dashboard/dogadjaji-dashboard.component';
import { EditDogadjajComponent } from './Dogadjaji/edit-dogadjaj/edit-dogadjaj.component';
import { EditObukaComponent } from './Obuke/edit-obuka/edit-obuka.component';
import { ObukeDashboardComponent } from './Obuke/obuke-dashboard/obuke-dashboard.component';
import { EditVijestComponent } from './Vijesti/edit-vijest/edit-vijest.component';
import { VijestiDashboardComponent } from './Vijesti/vijesti-dashboard/vijesti-dashboard.component';
import { KursDashboardComponent } from './Kursevi/kurs-dashboard/kurs-dashboard.component';
import { EditKursComponent } from './Kursevi/edit-kurs/edit-kurs.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { LoggedResetPasswordComponent } from './logged-reset-password/logged-reset-password.component';
import { PrijavaDashboardComponent } from './Prijave/prijava-dashboard/prijava-dashboard.component';
import { PrijaveDashboardComponent } from './Prijave/prijave-dashboard/prijave-dashboard.component';
import { PublikacijeDashboardComponent } from './Publikacije/publikacije-dashboard/publikacije-dashboard.component';
import { EditPublikacijeComponent } from './Publikacije/edit-publikacije/edit-publikacije.component';
import { KorisnikComponent } from './Korisnici/korisnik/korisnik.component';
import { IndexComponent } from './index.component';

const routes: Routes = [
  {path: '', component: AdminComponent, canActivate: [AuthGuard], children: [
    {path: '', component: IndexComponent, data: {breadcrumb: 'Vijesti'}},
    {path: 'vijesti-dashboard', component: VijestiDashboardComponent, data: {breadcrumb: 'Vijesti'}},
    {path: 'vijest-create', component: EditVijestComponent, data: {breadcrumb: 'Dodavanje nove vijesti'}},
    {path: 'vijest-edit/:id', component: EditVijestComponent, data: {breadcrumb: 'Izmjena vijesti'}},
    {path: 'kurs-dashboard', component: KursDashboardComponent, data: {breadcrumb: 'Kursevi'}},
    {path: 'kurs-create', component: EditKursComponent, data: {breadcrumb: 'Dodavanje novog kursa'}},
    {path: 'kurs-edit/:id', component: EditKursComponent, data: {breadcrumb: 'Izmjena kursa'}},
    {path: 'korisnici', component: KorisniciComponent, data: {breadcrumb: 'Korisnici'}},
    {path: 'korisnik/:email', component: KorisnikComponent, data: {breadcrumb: 'Korisnik'}},
    {path: 'korisnici-create', component: NoviKorisnikComponent, data: {breadcrumb: 'Dodavanje novog korisnika'}},
    {path: 'admin-password-change/:email', component: AdminCnahgePwComponent, data: {breadcrumb: 'Promjena lozinke'}},
    {path: 'dogadjaji-dashboard', component: DogadjajiDashboardComponent, data: {breadcrumb: 'Događaji'}},
    {path: 'dogadjaj-create', component: EditDogadjajComponent, data: {breadcrumb: 'Dodavanje novog događaja'}},
    {path: 'dogadjaj-edit/:id', component: EditDogadjajComponent, data: {breadcrumb: 'Izmjena događaja'}},
    {path: 'obuke-dashboard', component: ObukeDashboardComponent, data: {breadcrumb: 'Obuke'}},
    {path: 'obuka-create', component: EditObukaComponent, data: {breadcrumb: 'Dodavanje nove obuke'}},
    {path: 'obuka-edit/:id', component: EditObukaComponent, data: {breadcrumb: 'Izmjena obuke'}},
    {path: 'prijava/:id', component: PrijavaDashboardComponent, data: {breadcrumb: 'Prijava'}},
    {path: 'prijave', component: PrijaveDashboardComponent, data: {breadcrumb: 'Prijave'}},
    {path: 'publikacije-dashboard', component: PublikacijeDashboardComponent, data: {breadcrumb: 'Publikacije'}},
    {path: 'publikacije-create', component: EditPublikacijeComponent, data: {breadcrumb: 'Dodavanje nove publikacije'}},
    {path: 'publikacije-edit/:id', component: EditPublikacijeComponent, data: {breadcrumb: 'Izmjena publikacije'}},
    {path: 'loggedresetpassword/:email', component: LoggedResetPasswordComponent, data: {breadcrumb: 'Promjena lozinke'}},
  ]},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
