import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AngularFireDatabase} from "angularfire2/database";
import {AuthenticatieService} from "../services/authenticatie.service";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private authServie: AuthenticatieService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const that = this;
    return new Promise(function (resolve, reject) {
      that.authServie.isLoggedIn().subscribe(user => {
        that.authServie.isGebruikerBeheerder(user.uid).then(function (value) {
          if (!value) {
            that.router.navigate(['/login']);
          }
          resolve(value);
        });
      });
    });
  }
}
