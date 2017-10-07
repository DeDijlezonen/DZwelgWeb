import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable,  } from '@angular/core';
import {AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthenticatieService {

  constructor(
    public afAuth: AngularFireAuth,
    private afdb: AngularFireDatabase,
  ) { }

  login(email: string, wachtwoord: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, wachtwoord);
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isLoggedIn() {
    return this.afAuth.authState;
  }

  getCurrentUser() {
    return this.afAuth.auth.currentUser;
  }

  isGebruikerByRolnaam(uid: string, rolnaam: string): Promise<boolean> {
    const that = this;
    return new Promise(function(resolve, reject) {
      that.getGebruikerrollen(uid).subscribe(rollen => {
        if (rollen[rolnaam]) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  private getGebruikerrollen(uid: string) {
    return this.afdb.object('/gebruikers/' + uid + '/rollen');
  }
}
