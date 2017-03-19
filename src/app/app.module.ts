import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { TemplateComponent } from './template/template.component';
import { EvenementenComponent } from './evenementen/evenementen.component';
import { PaginaNietGevondenComponent } from './pagina-niet-gevonden/pagina-niet-gevonden.component';

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
  ] },
  { path: '**', component: PaginaNietGevondenComponent }
];

@NgModule({
  declarations: [
    AppComponent, TemplateComponent, EvenementenComponent, PaginaNietGevondenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, 'dzwelg-web')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
