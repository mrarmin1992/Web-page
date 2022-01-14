import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxNavbarModule } from 'ngx-bootstrap-navbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import * as $ from 'jquery';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrijavaComponent } from './prijava/prijava.component';
import { HvalaComponent } from './prijava/hvala/hvala.component';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [
    AppComponent,
    PrijavaComponent,
    HvalaComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxNavbarModule,
    HomeModule,
    NgxSpinnerModule,
    CarouselModule.forRoot(),
    ReactiveFormsModule,
    RichTextEditorAllModule
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
