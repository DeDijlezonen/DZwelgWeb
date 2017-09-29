import { Router } from '@angular/router';
import { AuthenticatieService } from './../services/authenticatie.service';
import { Component, OnInit } from '@angular/core';
import { version } from './version';
import {NgxPermissionsService, NgxRolesService} from 'ngx-permissions';
import {Rollen} from '../utils/functions';

@Component({
  selector: 'dzwelg-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  currentVersion: string;

  constructor(
    private authenticatieService: AuthenticatieService,
    private router: Router,
    private rolesService: NgxRolesService,
  ) { this.currentVersion = version; }

  ngOnInit() {
    // if (!this.authenticatieService.isLoggedIn()) {
    //   this.router.navigate(['login']);
    // }
    this.authenticatieService.isLoggedIn().subscribe((user) => {
      if (!user) {
        this.router.navigate(['login']);
      }
    });

    const beheerder = Rollen.Beheerder;
    const stockbeheerder = Rollen.Stockbeheerder;
    const lid = Rollen.Lid;

    this.authenticatieService.isLoggedIn().subscribe((user) => {
      this.rolesService.addRoles({
        beheerder: () => {
          return this.authenticatieService.isGebruikerByRolnaam(user.uid, Rollen.Beheerder);
        },
        stockbeheerder: () => {
          return this.authenticatieService.isGebruikerByRolnaam(user.uid, Rollen.Stockbeheerder);
        },
        lid: () => {return true; }
      });
    });
  }

  uitloggen() {
    this.authenticatieService.logout();
  }

}
