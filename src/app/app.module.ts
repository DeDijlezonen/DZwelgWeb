import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyCntxaPSHYLkVIEyZEkUwMKlU6frX2ZLlQ',
  authDomain: 'dzwelg-dev.firebaseapp.com',
  databaseURL: 'https://dzwelg-dev.firebaseio.com',
  storageBucket: 'dzwelg-dev.appspot.com',
  messagingSenderId: '258825135187'
};

@NgModule({
  declarations: [
    AppComponent
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
