import { FormHelper } from '../utils/functions';
import { element } from 'protractor';
import { IAlert } from '../model/alert';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Gebruiker } from '../model/gebruiker';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

// const positiefValidator = (control: AbstractControl) => {
//   return control.value >= 0 ? null : {
//     positiefValidator: true,
//   };
// };

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

  constructor(private afdb: AngularFireDatabase, private modalService: NgbModal, private fb: FormBuilder) { }

  ngOnInit() {
    this.gebruikers = this.afdb.list('gebruikers');
    this.createGebruikerAanmakenForm();
  }

  createGebruikerAanmakenForm() {
    this.gebruikerAanmakenFormGroup = this.fb.group({
      voornaam: ['', Validators.required],
      achternaam: ['', Validators.required],
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
      const fbLid = this.gebruikers.push({
        voornaam: model.voornaam,
        achternaam: model.achternaam,
        saldo: 0,
      });

      const key = fbLid.key;
      model.id = key;
      this.gebruikers.update(key, model);

      this.sluitGebruikerAanmakenModal();
      this.gebruikerAanmakenFormGroup.reset();
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
      succes => {
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
}
