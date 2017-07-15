import { FormHelper } from './../utils/functions';
import { DzwelgValidators } from './../utils/validators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IAlert } from './../model/alert';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Consumptie } from './../model/Consumptie';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {StockLijn} from "../model/stocklijn";
import {error} from "util";

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
    this.consumpties = this.afdb.list('consumpties',  {
        query: {
          orderByChild: 'naam',
        }
      }
    );
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

  verwijderConsumptieEnSluit(consumptie: FirebaseObjectObservable<Consumptie>) {
    consumptie.subscribe((value: Consumptie) => {
      if (value.id && value.stocklijnId) {
        this.consumptieVerwijderen(value.id, value.stocklijnId);
        this.sluitVerwijderConsumptieModal();
      }
    });
  }

  consumptieVerwijderen(id: string, stocklijnId: string) {
    this.consumpties.remove(id).then(
      succes => {
        this.alert = {
          type: 'success',
          message: 'De consumptie werd succesvol verwijderd.'
        };
        this.stocklijnVerwijderen(stocklijnId);
      },
      error => {
        this.alert = {
          type: 'danger',
          message: 'De consumptie kon niet worden verwijderd. (' + error.name + ': ' + error.message + ')'
        };
      },
    );
  }

  consumptieAanmaken(model: Consumptie) {
    if (this.consumptieAanmakenForm.invalid) {
      const foutBoodschap = FormHelper.getFormErrorMessage(this.consumptieAanmakenForm);

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

      this.stocklijnAanmaken(model);
    }
  }

  private stocklijnAanmaken(consumptie: Consumptie) {
    const stockLijnen: FirebaseListObservable<StockLijn[]> = this.afdb.list('stock');
    const stockLijn: StockLijn = {
      id: null,
      consumptieId: consumptie.id,
      aantalInStock: 0,
    };
    const key = stockLijnen.push(stockLijn).key;
    stockLijn.id = key;
    stockLijnen.update(key, stockLijn);
    consumptie.stocklijnId = key;
    this.consumpties.update(consumptie.id, consumptie);
  }

  private stocklijnVerwijderen(verwijderId: string) {
    const stock = this.afdb.list('stock');
    stock.remove(verwijderId).then(
      (success) => {},
      (error) => {
        this.alert = {
          type: 'danger',
          message: 'De consumptie werd verwijderd, maar bijhorende stocklijn kon niet verwijderd worden. (' + error.name + ': ' + error.message + ')',
        };
      }
    );
  }
}
