import {Router} from '@angular/router';
import {AuthenticatieService} from './../services/authenticatie.service';
import {Component, OnInit} from '@angular/core';
import {version} from './version';
import {NgxRolesService} from 'ngx-permissions';
import {Rollen} from '../utils/functions';

@Component({
  selector: 'dzwelg-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  currentVersion: string;
  lidLiteral = Rollen.Lid;
  beheerderLiteral = Rollen.Beheerder;
  stockBeheerderLiteral = Rollen.Stockbeheerder;


  constructor(private authenticatieService: AuthenticatieService,
              private router: Router,
              private rolesService: NgxRolesService) {
    this.currentVersion = version;
  }

  ngOnInit() {
    this.authenticatieService.isLoggedIn().subscribe((user) => {
      if (!user) {
        this.router.navigate(['login']);
      }
    });

    this.authenticatieService.isLoggedIn().subscribe((user) => {
      if (user) {
        this.rolesService.addRoles({
          [Rollen.Beheerder]: () => {
            return this.authenticatieService.isGebruikerByRolnaam(user.uid, Rollen.Beheerder);
          },
          [Rollen.Stockbeheerder]: () => {
            return this.authenticatieService.isGebruikerByRolnaam(user.uid, Rollen.Stockbeheerder);
          },
          [Rollen.Lid]: () => {
            return this.authenticatieService.isGebruikerByRolnaam(user.uid, Rollen.Lid);
          }
        });
      }
    });
  }

  uitloggen() {
    this.authenticatieService.logout();
  }

}
