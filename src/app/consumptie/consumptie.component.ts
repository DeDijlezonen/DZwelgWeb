import { FormHelper } from './../utils/functions';
import { DzwelgValidators } from './../utils/validators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IAlert } from './../model/alert';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Consumptie } from './../model/Consumptie';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'dzwelg-consumptie',
  templateUrl: './consumptie.component.html',
  styleUrls: ['./consumptie.component.css']
})
export class ConsumptieComponent implements OnInit {

  consumpties: FirebaseListObservable<Consumptie[]>;
  alert: IAlert;
  teVerwijderenConsumptieId: string;
  teVerwijderenConsumptie: FirebaseObjectObservable<Consumptie>;
  verwijderConsumptieModal: NgbModalRef;
  consumptieAanmakenForm: FormGroup;

  constructor(private afdb: AngularFireDatabase, private modalService: NgbModal, private fb: FormBuilder) { }

  ngOnInit() {
    this.consumpties = this.afdb.list('consumpties');
    this.createConsumptieAanmakenForm();
  }

  createConsumptieAanmakenForm() {
    this.consumptieAanmakenForm = this.fb.group({
      naam: ['', Validators.required],
      prijs: [0, [Validators.required, DzwelgValidators.positiefValidator]]
    });
  }

  openConsumptieVerwijderenModel(content, id: string) {
    this.teVerwijderenConsumptieId = id;
    this.teVerwijderenConsumptie = this.afdb.object('/consumpties/' + id);
    this.verwijderConsumptieModal = this.modalService.open(content);
  }

  sluitVerwijderConsumptieModal() {
    this.teVerwijderenConsumptieId = '';
    this.teVerwijderenConsumptie = null;
    this.verwijderConsumptieModal.close();
  }

  verwijderConsumptieEnSluit(id: string) {
    this.consumptieVerwijderen(id);
    this.sluitVerwijderConsumptieModal();
  }

  consumptieVerwijderen(id: string) {
    this.consumpties.remove(id).then(
      succes => {
        this.alert = {
          type: 'success',
          message: 'De consumptie werd succesvol verwijderd.'
        };
      },
      error => {
        this.alert = {
          type: 'danger',
          message: 'De consumptie kon niet worden verwijderd.'
        };
      },
    );
  }

  consumptieAanmaken(model: Consumptie) {
    if (this.consumptieAanmakenForm.invalid) {
      const foutBoodschap = FormHelper.getFormErrorMessage(this.consumptieAanmakenForm);

      // const controls = this.consumptieAanmakenForm.controls;
      // _.keys(controls).forEach((control_key) => {
      //   const errors = controls[control_key].errors;
      //   if (errors) {
      //     foutBoodschap += control_key + ': ';
      //     _.keys(errors).forEach((error_key: string, index) => {
      //       foutBoodschap += (error_key.toString() + (_.lastIndexOf(errors) === index ? '' : '; '));
      //     });
      //   }
      // });

      this.alert = {
        type: 'danger',
        message: foutBoodschap,
      };
    } else {
      const fbCosumptie = this.consumpties.push({
        naam: model.naam,
        prijs: model.prijs
      });

      const key = fbCosumptie.key;
      model.id = key;
      this.consumpties.update(key, model);

      this.consumptieAanmakenForm.reset();
      this.consumptieAanmakenForm.controls['prijs'].setValue(0);
    }

  }
}
