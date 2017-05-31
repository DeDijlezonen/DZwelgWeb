import { IAlert } from './../model/alert';
import { Router } from '@angular/router';
import { AuthenticatieService } from './../services/authenticatie.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'dzwelg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  alerts: IAlert[] = [];

  private email: string;
  private wachtwoord: string;

  constructor(
    public authenticatieService: AuthenticatieService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  login() {
    this.authenticatieService.login(this.email, this.wachtwoord).then((data) => {
      this.router.navigate(['evenementen']);
    }).catch((error) => {
      this.alerts.push({
        type: 'danger',
        message: error.message
      });
    });
  }

}
