import {User} from './../model/user';
import {IAlert} from './../model/alert';
import {Router} from '@angular/router';
import {AuthenticatieService} from './../services/authenticatie.service';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AngularFireDatabase} from 'angularfire2/database';
import {Rollen} from '../utils/functions';

@Component({
  selector: 'dzwelg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  alert: IAlert;

  loginForm: FormGroup;

  constructor(public authenticatieService: AuthenticatieService,
              private router: Router,
              private fb: FormBuilder,
              private afdb: AngularFireDatabase, ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      wachtwoord: ['', Validators.required]
    });
  }

  login(model: User, isValid: boolean) {
    this.authenticatieService.login(model.email, model.wachtwoord).then((data) => {
      this.afdb.object('gebruikers/' + data.uid).subscribe(gebruiker => {
        if (gebruiker.rollen[Rollen.Beheerder]) {
          this.router.navigate(['activiteiten']);
        } else if (gebruiker.rollen[Rollen.Stockbeheerder]) {
          this.router.navigate(['consumpties']);
        } else if (gebruiker.rollen[Rollen.Lid]) {
          this.router.navigate(['saldo']);
        } else if (gebruiker.rollen[Rollen.Kassaverantwoordelijke]) {
          this.alert = {
            type: 'danger',
            message: 'Enkel leden hebben toegang tot dit platform',
          };
        }
      });
    }).catch((error) => {
      this.alert = {
        type: 'danger',
        message: error.message
      };
    });
  }

}
