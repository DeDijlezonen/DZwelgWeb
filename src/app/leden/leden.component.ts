import { FormHelper } from './../utils/functions';
import { element } from 'protractor';
import { IAlert } from './../model/alert';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Lid } from './../model/lid';
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
  templateUrl: './leden.component.html',
  styleUrls: ['./leden.component.css']
})
export class LedenComponent implements OnInit {

  leden: FirebaseListObservable<Lid[]>;
  lidAanmakenModal: NgbModalRef;
  lidAanmakenFormGroup: FormGroup;
  teVerwijderenLidId: string;
  teVerwijderenLid: FirebaseObjectObservable<Lid>;
  verwijderLidModal: NgbModalRef;
  alert: IAlert;
  alertLidAanmaken: IAlert;

  constructor(private afdb: AngularFireDatabase, private modalService: NgbModal, private fb: FormBuilder) { }

  ngOnInit() {
    this.leden = this.afdb.list('leden');
    this.createLidAanmakenForm();
  }

  createLidAanmakenForm() {
    this.lidAanmakenFormGroup = this.fb.group({
      voornaam: ['', Validators.required],
      achternaam: ['', Validators.required],
    });
  }

  openLidAanmakenModal(content) {
    this.lidAanmakenModal = this.modalService.open(content);
  }

  sluitLidAanmakenModal() {
    this.alertLidAanmaken = null;
    this.lidAanmakenModal.close();
    this.lidAanmakenFormGroup.reset();
  }

  lidAanmaken(model: Lid) {
    if (this.lidAanmakenFormGroup.invalid) {
      const foutBoodschap = FormHelper.getFormErrorMessage(this.lidAanmakenFormGroup);

      // const controls = this.lidAanmakenFormGroup.controls;
      // _.keys(controls).forEach((control_key) => {
      //   const errors = controls[control_key].errors;
      //   if (errors) {
      //     foutBoodschap += control_key + ': ';
      //     _.keys(errors).forEach((error_key: string, index) => {
      //       foutBoodschap += (error_key.toString() + (_.lastIndexOf(errors) === index ? '' : '; '));
      //     });
      //   }
      // });

      this.alertLidAanmaken = {
        type: 'danger',
        message: foutBoodschap,
      };
    } else {
      const fbLid = this.leden.push({
        voornaam: model.voornaam,
        achternaam: model.achternaam,
        saldo: 0,
      });

      const key = fbLid.key;
      model.id = key;
      this.leden.update(key, model);

      this.sluitLidAanmakenModal();
      this.lidAanmakenFormGroup.reset();
    }
  }

  openLidVerwijderenModel(content, id: string) {
    this.teVerwijderenLidId = id;
    this.teVerwijderenLid = this.afdb.object('/leden/' + id);
    this.verwijderLidModal = this.modalService.open(content);
  }

  sluitVerwijderLidModal() {
    this.teVerwijderenLidId = '';
    this.teVerwijderenLid = null;
    this.verwijderLidModal.close();
  }

  verwijderLidEnSluit(id: string) {
    this.lidVerwijderen(id);
    this.sluitVerwijderLidModal();
  }

  lidVerwijderen(id: string) {
    this.leden.remove(id).then(
      succes => {
        this.alert = {
          type: 'success',
          message: 'Het lid werd succesvol verwijderd.'
        };
      },
      error => {
        this.alert = {
          type: 'danger',
          message: 'Het lid kon niet worden verwijderd.'
        };
      },
    );
  }
}
