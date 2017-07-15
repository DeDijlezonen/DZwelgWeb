import { User } from './../model/user';
import { IAlert } from './../model/alert';
import { Router } from '@angular/router';
import { AuthenticatieService } from './../services/authenticatie.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'dzwelg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  alert: IAlert;

  loginForm: FormGroup;

  // private email: string;
  // private wachtwoord: string;

  constructor(
    public authenticatieService: AuthenticatieService,
    private router: Router,
    private fb: FormBuilder
  ) {
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
      this.router.navigate(['activiteiten']);
    }).catch((error) => {
      this.alert = {
        type: 'danger',
        message: error.message
      };
    });
  }

}
