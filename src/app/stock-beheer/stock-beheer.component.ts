import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {StockLijn} from "../model/stocklijn";
import {IAlert} from "../model/alert";
import {Consumptie} from "../model/Consumptie";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormHelper} from "../utils/functions";
import {DzwelgValidators} from "../utils/validators";
import 'rxjs/add/operator/take';

interface StockViewModel {
  id: string;
  consumptieId: string;
  consumptieNaam: string;
  aantalInStock: number;
}

@Component({
  selector: 'dzwelg-stock-beheer',
  templateUrl: './stock-beheer.component.html',
  styleUrls: ['./stock-beheer.component.css']
})
export class StockBeheerComponent implements OnInit {

  stockFLO: FirebaseListObservable<StockLijn[]>;
  consumptiesFLO: FirebaseListObservable<Consumptie[]>
  stocklijnen: StockViewModel[] = [];
  alert: IAlert;
  stockAantalModal: NgbModalRef;
  stockAantalAanpassenForm: FormGroup;
  teBewerkenStockViewModel: StockViewModel;

  constructor(private afdb: AngularFireDatabase, private modalService: NgbModal, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.stockFLO = this.afdb.list('stock');
    this.getStockViewModels();
    this.createStockAantalAanpassenForm();
  }

  // getData() {
  //   this.consumptiesFLO = this.afdb.list('consumpties');
  //   this.stockFLO = this.afdb.list('stock');
  //
  // }

  getStockViewModels() {
    this.stockFLO.subscribe((stock: StockLijn[]) => {
      this.stocklijnen = [];
      stock.forEach((stocklijn: StockLijn) => {
        this.getConsumptie(stocklijn.consumptieId).subscribe((consumptie: Consumptie) => {
          if (stocklijn.id) {
            this.stocklijnen.push({
              id: stocklijn.id,
              consumptieId: stocklijn.consumptieId,
              consumptieNaam: consumptie.naam,
              aantalInStock: stocklijn.aantalInStock,
            });
          }
        });
      });
    });
  }

  getConsumptie(consumptieId: string) {
    return this.afdb.object('/consumpties/' + consumptieId);
  }

  createStockAantalAanpassenForm() {
    this.stockAantalAanpassenForm = this.fb.group({
      aantalInStock: [0, [Validators.required, DzwelgValidators.positiefValidator]],
    });
  }

  openStockAanpassenModal(content, stockViewModel: StockViewModel) {
    this.teBewerkenStockViewModel = stockViewModel;
    this.stockAantalModal = this.modalService.open(content);
  }

  stockAantalAanpassen(model) {
    if (this.stockAantalAanpassenForm.valid) {
      const stocklijn: StockLijn = {
        id: this.teBewerkenStockViewModel.id,
        consumptieId: this.teBewerkenStockViewModel.consumptieId,
        aantalInStock: this.teBewerkenStockViewModel.aantalInStock + model.aantalInStock,
      };
      this.stockFLO.update(this.teBewerkenStockViewModel.id, stocklijn);
      this.stockAantalAanpassenForm.reset();
      this.stockAantalAanpassenForm.controls['aantalInStock'].setValue(0);
      this.sluitModal();
    } else {
      const foutBoodschap = FormHelper.getFormErrorMessage(this.stockAantalAanpassenForm);
      this.alert = {
        type: 'danger',
        message: foutBoodschap,
      };
    }
  }

  sluitModal() {
    this.alert = null;
    this.teBewerkenStockViewModel = null;
    this.stockAantalModal.close();
    this.stockAantalAanpassenForm.reset();
    this.stockAantalAanpassenForm.controls['aantalInStock'].setValue(0);
  }

}
