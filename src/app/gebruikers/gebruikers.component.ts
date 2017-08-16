import {FormHelper} from '../utils/functions';
import {IAlert} from '../model/alert';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Gebruiker} from '../model/gebruiker';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {Component, OnInit} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'dzwelg-leden',
  templateUrl: './gebruikers.component.html',
  styleUrls: ['./gebruikers.component.css']
})
export class GebruikersComponent implements OnInit {

  gebruikers: FirebaseListObservable<Gebruiker[]>;
  gebruikerAanmakenModal: NgbModalRef;
  gebruikerAanmakenFormGroup: FormGroup;
  teVerwijderenGebruikerId: string;
  teVerwijderenGebruiker: FirebaseObjectObservable<Gebruiker>;
  verwijderGebruikerModal: NgbModalRef;
  alert: IAlert;
  alertGebruikerAanmaken: IAlert;
  disableAanmakenForm: boolean;

  constructor(public httpClient: HttpClient, private afdb: AngularFireDatabase, private afAuth: AngularFireAuth, private modalService: NgbModal, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.gebruikers = this.afdb.list('gebruikers');
    this.createGebruikerAanmakenForm();
  }

  createGebruikerAanmakenForm() {
    this.gebruikerAanmakenFormGroup = this.fb.group({
      voornaam: ['', Validators.required],
      achternaam: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  openGebruikerAanmakenModal(content) {
    this.gebruikerAanmakenModal = this.modalService.open(content);
  }

  sluitGebruikerAanmakenModal() {
    this.alertGebruikerAanmaken = null;
    this.gebruikerAanmakenModal.close();
    this.gebruikerAanmakenFormGroup.reset();
  }

  gebruikerAanmaken(model: Gebruiker) {
    if (this.gebruikerAanmakenFormGroup.invalid) {
      const foutBoodschap = FormHelper.getFormErrorMessage(this.gebruikerAanmakenFormGroup);

      this.alertGebruikerAanmaken = {
        type: 'danger',
        message: foutBoodschap,
      };
    } else {
      this.disableAanmakenForm = true;
      this.alertGebruikerAanmaken = {
        type: 'info',
        message: 'Bezig met aanmaken...'
      };

      this.afAuth.auth.createUserWithEmailAndPassword(model.email, 'default')
        .then(gebruiker => {
          // firebase uid van aangemaakte gebruiker op object setten
          model.id = gebruiker.uid;
          // gebruiker met fb uid naar database schrijven
          this.gebruikers.update(gebruiker.uid, {
            uid: model.id,
            voornaam: model.voornaam,
            achternaam: model.achternaam,
            saldo: 0
          });
          this.sluitGebruikerAanmakenModal();
          this.gebruikerAanmakenFormGroup.reset();
          this.disableAanmakenForm = false;
        })
        .catch(error => {
          this.alertGebruikerAanmaken = {
            type: 'danger',
            message: error.message,
          };
          this.disableAanmakenForm = false;
        });
    }
  }

  openGebruikerVerwijderenModel(content, id: string) {
    this.teVerwijderenGebruikerId = id;
    this.teVerwijderenGebruiker = this.afdb.object('/gebruikers/' + id);
    this.verwijderGebruikerModal = this.modalService.open(content);
  }

  sluitVerwijderGebruikerModal() {
    this.teVerwijderenGebruikerId = '';
    this.teVerwijderenGebruiker = null;
    this.verwijderGebruikerModal.close();
  }

  verwijderGebruikerEnSluit(id: string) {
    this.gebruikerVerwijderen(id);
    this.sluitVerwijderGebruikerModal();
  }

  gebruikerVerwijderen(id: string) {
    this.gebruikers.remove(id).then(
      () => {
        this.alert = {
          type: 'success',
          message: 'De gebruiker werd succesvol verwijderd.'
        };
      },
      error => {
        this.alert = {
          type: 'danger',
          message: 'De gebruiker kon niet worden verwijderd. (' + error.name + ': ' + error.message + ')'
        };
      },
    );
  }

  /**
   * Verwijderd een gebruiker uit Firebase met behulp van de deleteUser Cloud Function
   * Noot: de facto zal de gebruiker ook uit de database worden verwijderd, omdat het deleten van een Firebase-
   * gebruiker automatisch de Cloud Function deleteUserFromDB doet uitvoeren
   *
   * @param {string} uid Het Firebase UID van de te verwijderen gebruiker
   */
  verwijderGebruiker(uid: string) {
    let that = this;
    //token van aangemelde gebruiker ophalen
    this.afAuth.auth.currentUser.getToken(true)
      .then(function (token) {
        //send token to backend
        that.httpClient.post(
          'https://us-central1-dzwelg-dev.cloudfunctions.net/deleteUser',   // url van cloud function
          null,                                                           // wordt niet gebruikt
          {
            params: new HttpParams().set('idToken', token).set('uid', uid)      // parameters voor de function (idToken en UID)
          })
          .subscribe((data) => {
            console.log("GELUKT");
            // hoewel er data wordt opgevangen en er een bericht wordt gestuurd vanuit de function,
            // krijgt ik dit niet mee met de data hier... (evt checken op http 200, maar dat lijkt me redundant, omdat
            // de volgende regels errors opvangt)
            console.log(data);
          }, (fout) => {
            console.log("FOUT");
            // foutbericht uit de callback halen
            console.log(fout.error.message);
          });
      })
  }
}
