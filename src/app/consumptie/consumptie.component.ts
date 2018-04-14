import { FormHelper } from './../utils/functions';
import { DzwelgValidators } from './../utils/validators';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { IAlert } from './../model/alert';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Consumptie } from './../model/Consumptie';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {Component, OnInit, ViewChild} from '@angular/core';
import {StockLijn} from "../model/stocklijn";

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
  teBewerkenConsumptieId: string;
  teBewerkenConsumptie: Consumptie;

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
    this.consumpties.update(id, { actief: false }).then(
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
        prijs: model.prijs,
        actief: true,
      });

      const key = fbCosumptie.key;
      model.id = key;
      this.consumpties.update(key, model);

      this.consumptieAanmakenForm.reset();
      this.consumptieAanmakenForm.controls['prijs'].setValue(0);

      this.stocklijnAanmaken(model);
    }
  }

  bewerkConsumptie(consumptie: Consumptie) {
    this.teBewerkenConsumptieId = consumptie.id;
    this.teBewerkenConsumptie = {
      id: consumptie.id,
      naam: consumptie.naam,
      prijs: consumptie.prijs,
      stocklijnId: consumptie.stocklijnId,
      actief: consumptie.actief,
    };
  }

  concludeerBewerken() {
    let foutbooschap = '';
    if (!this.teBewerkenConsumptie.naam) {
      foutbooschap += '"Naam" is verplicht.\n';
    }
    if (!this.teBewerkenConsumptie.prijs) {
      foutbooschap += '"Prijs" is verplicht.\n';
    }
    if (isNaN(this.teBewerkenConsumptie.prijs)) {
      foutbooschap += '"Prijs" moet een nummerieke waarde hebben.\n';
    } else {
      if (this.teBewerkenConsumptie.prijs < 0) {
        foutbooschap += 'De waarde van "prijs" moet hoger of gelijk zijn aan 0.\n';
      }
    }
    if (foutbooschap) {
      this.alert = {
        type: 'danger',
        message: foutbooschap
      };
    } else {
      this.consumpties.update(this.teBewerkenConsumptie.id, this.teBewerkenConsumptie);
      this.resetTeBewerken();
    }
  }

  annulleerBewerken() {
    this.resetTeBewerken();
  }

  private resetTeBewerken() {
    this.teBewerkenConsumptieId = null;
    this.teBewerkenConsumptie = null;
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
