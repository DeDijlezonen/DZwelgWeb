import { Router } from '@angular/router';
import { AuthenticatieService } from './../services/authenticatie.service';
import { Component, OnInit } from '@angular/core';
import { version } from './version';

@Component({
  selector: 'dzwelg-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  currentVersion: string;

  constructor(
    private authenticatieService: AuthenticatieService,
    private router: Router
  ) { this.currentVersion = version}

  ngOnInit() {
    // if (!this.authenticatieService.isLoggedIn()) {
    //   this.router.navigate(['login']);
    // }
	
    this.authenticatieService.isLoggedIn().subscribe((user) => {
      if (!user) {
        this.router.navigate(['login']);
      }
    });
  }

  uitloggen() {
    this.authenticatieService.logout();
  }

}
