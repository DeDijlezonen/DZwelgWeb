import { Router } from '@angular/router';
import { AuthenticatieService } from '../services/authenticatie.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dzwelg-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  currentVersion: string;

  constructor(
    private authenticatieService: AuthenticatieService,
    private router: Router) {
  }

  // function resultaat () {
  //   var temp = JSON.parse(this.responseText).version;
  //   this.currentVersion = temp.version;
  // }



  ngOnInit() {
    // if (!this.authenticatieService.isLoggedIn()) {
    //   this.router.navigate(['login']);
    // }

    this.authenticatieService.isLoggedIn().subscribe((user) => {
      if (!user) {
        this.router.navigate(['login']);
      }
    });

    // versie opvragen vanuit package.json
    let request = new XMLHttpRequest();
    request.onload = (result) => {
      let packageJSON = JSON.parse(result.srcElement['responseText']);
      this.currentVersion = packageJSON.version;
    };
    request.open("get", "./package.json", true);
    request.send();
  }

  uitloggen() {
    this.authenticatieService.logout();
  }

}
