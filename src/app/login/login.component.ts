import { Router } from '@angular/router';
import { AuthenticatieService } from './../services/authenticatie.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dzwelg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private email: string;
  private wachtwoord: string;

  constructor(
    public authenticatieService: AuthenticatieService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.authenticatieService.login(this.email, this.wachtwoord).then((data) => {
      this.router.navigate(['evenementen']);
    });
  }

}
