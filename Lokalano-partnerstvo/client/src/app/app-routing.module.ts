import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from './core/aboutus/aboutus.component';
import { NotFoundComponent } from './core/errors/not-found/not-found.component';
import { ServerErrorComponent } from './core/errors/server-error/server-error.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { HvalaComponent } from './prijava/hvala/hvala.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { ONamaComponent } from './shared/components/o-nama/o-nama.component';
import { PartnerComponent } from './shared/components/partner/partner.component';
import { VijestDetailsComponent } from './vijesti/vijest-details/vijest-details.component';
import { VijestiComponent } from './vijesti/vijesti.component';


const routes: Routes = [
  {path: '', component: HomeComponent, data: {breadcrumb: 'Početna'}},
  {
    path: 'obuke', loadChildren: () => import('./obuke/obuke.module').then(mod => mod.ObukeModule)
  },
  {
    path: 'dogadjaji', loadChildren: () => import('./dogadjaji/dogadjaji.module').then(mod => mod.DogadjajiModule)
  },
  {
    path: 'publikacije', loadChildren: () => import('./publikacije/publikacije.module').then( mod => mod.PublikacijeModule)
  },
  {
    path: 'vijesti', loadChildren: () => import('./vijesti/vijesti.module').then(mod => mod.VijestiModule)
  },
  {
    path: 'kursevi', loadChildren: () => import('./kursevi/kursevi.module').then(mod => mod.KurseviModule)
  },
  {
    path: 'account', loadChildren: () => import('./account/account.module')
    .then(mod => mod.AccountModule), data: { breadcrumb: {skip: true} }
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/admin.module')
      .then(mod => mod.AdminModule), data: { breadcrumb: 'Dashboard' }
  },
  // {path: 'prijava-kurs/:id', loadChildren: () => import('./prijava/prijava.module').then(mod => mod.PrijavaModule)},
  // {path: 'prijava-obuka/:id', loadChildren: () => import('./prijava/prijava.module').then(mod => mod.PrijavaModule)},
  {path: 'prijava-kurs/:id', component: PrijavaComponent},
  {path: 'prijava-obuka/:id', component: PrijavaComponent},
  {path: 'partner/:mail', component: PartnerComponent},
  {path: 'hvala', component: HvalaComponent},
  {path: 'about-us', component: ONamaComponent},
  {path: 'server-error', component: ServerErrorComponent, data: {breadcrumb: 'Server Error'}},
  {path: 'not-found', component: NotFoundComponent, data: {breadcrumb: 'Not Found'}},
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
