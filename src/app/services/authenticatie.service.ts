import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable,  } from '@angular/core';

@Injectable()
export class AuthenticatieService {

  constructor(
    public afAuth: AngularFireAuth,
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
}
