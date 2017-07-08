import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {StockLijn} from "../model/stocklijn";
import {IAlert} from "../model/alert";
import {Consumptie} from "../model/Consumptie";

interface StockViewModel {
  consumptieNaam: string;
  aantalInStock: number;
}

@Component({
  selector: 'dzwelg-stock-beheer',
  templateUrl: './stock-beheer.component.html',
  styleUrls: ['./stock-beheer.component.css']
})
export class StockBeheerComponent implements OnInit {

  stocklijnen: StockViewModel[] = [];
  alert: IAlert;

  constructor(private afdb: AngularFireDatabase) { }

  ngOnInit() {
    this.getStockViewModels();
  }

  getStockViewModels() {
    this.afdb.list('stock').subscribe((stock: StockLijn[]) => {
      stock.forEach((stockLijn: StockLijn) => {
        this.getConsumptie(stockLijn.consumptieId).subscribe((consumptie: Consumptie) => {
          this.stocklijnen.push({
            consumptieNaam: consumptie.naam,
            aantalInStock: stockLijn.aantalInStock,
          });
        });
      });
    });
  }

  getConsumptie(consumptieId: string) {
    return this.afdb.object('/consumpties/' + consumptieId);
  }

}
