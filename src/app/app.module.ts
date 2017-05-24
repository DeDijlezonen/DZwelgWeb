import { AuthenticatieService } from './services/authenticatie.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { TemplateComponent } from './template/template.component';
import { EvenementenComponent } from './evenementen/evenementen.component';
import { PaginaNietGevondenComponent } from './pagina-niet-gevonden/pagina-niet-gevonden.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyCntxaPSHYLkVIEyZEkUwMKlU6frX2ZLlQ',
  authDomain: 'dzwelg-dev.firebaseapp.com',
  databaseURL: 'https://dzwelg-dev.firebaseio.com',
  storageBucket: 'dzwelg-dev.appspot.com',
  messagingSenderId: '258825135187'
};

const routes: Routes = [
  { path: '', component: TemplateComponent, children: [
    { path: 'evenementen', component: EvenementenComponent },
    { path: '', redirectTo: '/evenementen', pathMatch: 'full' },
    { path: '404', component: PaginaNietGevondenComponent }
  ] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: TemplateComponent, children: [
    { path: '**', redirectTo: '/404', pathMatch: 'full' }
  ] }
];

@NgModule({
  declarations: [
    AppComponent, TemplateComponent, EvenementenComponent, PaginaNietGevondenComponent, LoginComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, 'dzwelg-web'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot(routes),
  ],
  providers: [AuthenticatieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
