import {Router} from '@angular/router';
import {AuthenticatieService} from './../services/authenticatie.service';
import {Component, OnInit} from '@angular/core';
import {version} from './version';
import {NgxRolesService} from 'ngx-permissions';
import {Rol} from '../utils/functions';

@Component({
  selector: 'dzwelg-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  currentVersion: string;
  lidLiteral = Rol.Lid;
  beheerderLiteral = Rol.Beheerder;
  stockBeheerderLiteral = Rol.Stockbeheerder;
  userIdentification = '';

  constructor(private authenticatieService: AuthenticatieService,
              private router: Router,
              private rolesService: NgxRolesService) {
    this.currentVersion = version;
  }

  ngOnInit() {

    this.authenticatieService.isLoggedIn().subscribe((user) => {
      if (!user) {
        this.router.navigate(['login']);
      } else {
        this.rolesService.addRoles({
          [Rol.Beheerder]: () => {
            return this.authenticatieService.isGebruikerByRolnaam(user.uid, Rol.Beheerder);
          },
          [Rol.Stockbeheerder]: () => {
            return this.authenticatieService.isGebruikerByRolnaam(user.uid, Rol.Stockbeheerder);
          },
          [Rol.Lid]: () => {
            return this.authenticatieService.isGebruikerByRolnaam(user.uid, Rol.Lid);
          }
        });

        this.setUserIdentification(user);
      }
    });
  }

  uitloggen() {
    this.authenticatieService.logout();
  }

  private setUserIdentification(user) {
    this.userIdentification = user.email;
  }

}
