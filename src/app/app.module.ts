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
import { ActiviteitenComponent } from './activiteiten/activiteiten.component';
import { PaginaNietGevondenComponent } from './pagina-niet-gevonden/pagina-niet-gevonden.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './alert/alert.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConsumptieComponent } from './consumptie/consumptie.component';
import { GebruikersComponent } from './gebruikers/gebruikers.component';
import { StockBeheerComponent } from './stock-beheer/stock-beheer.component';
import { ArraySorteerPipe } from './pipes/array-sorteer-pipe/array-sorteer.pipe';
import {firebaseConfig} from "../environments/environment";
import { ActiviteitAanmakenComponent } from './activiteit-aanmaken/activiteit-aanmaken.component';
import { EvenementenBewerkenComponent } from './evenementen-bewerken/evenementen-bewerken.component';
import { InschrijvingsFilterPipe } from './pipes/filter/filter.pipe';

const routes: Routes = [
  { path: '', component: TemplateComponent, children: [
    { path: 'activiteiten', component: ActiviteitenComponent },
    { path: 'gebruikers', component: GebruikersComponent },
    { path: 'activiteiten/aanmaken', component: ActiviteitAanmakenComponent },
    { path: 'activiteiten/bewerken/:id', component: EvenementenBewerkenComponent },
    { path: 'consumpties', component: ConsumptieComponent },
    { path: 'stock', component: StockBeheerComponent },
    { path: '', redirectTo: '/activiteiten', pathMatch: 'full' },
    { path: '404', component: PaginaNietGevondenComponent }
  ] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    ActiviteitenComponent,
    PaginaNietGevondenComponent,
    LoginComponent,
    AlertComponent,
    GebruikersComponent,
    ConsumptieComponent,
    StockBeheerComponent,
    ArraySorteerPipe,
    ActiviteitAanmakenComponent,
    EvenementenBewerkenComponent,
    InschrijvingsFilterPipe,
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
    ReactiveFormsModule,
  ],
  providers: [AuthenticatieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
