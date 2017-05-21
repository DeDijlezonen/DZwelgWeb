import { Evenement } from './../model/evenement';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { IAlert } from './../model/alert';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dzwelg-evenementen',
  templateUrl: './evenementen.component.html',
  styleUrls: ['./evenementen.component.css']
})
export class EvenementenComponent implements OnInit {

  evenementen: FirebaseListObservable<Evenement[]>;
  alerts: IAlert[] = [];
  evenement: Evenement = new Evenement();
  verwijderModal: NgbModalRef;
  teVerwijderenEvenementId: string;

  constructor(private afdb: AngularFireDatabase, private modalService: NgbModal) { }

  ngOnInit() {
    this.evenementen = this.afdb.list('evenementen');
  }

  public open(content, id: string) {
    this.teVerwijderenEvenementId = id;
    this.verwijderModal = this.modalService.open(content);
  }

  public sluit() {
    this.teVerwijderenEvenementId = '';
    this.verwijderModal.close();
  }

  public verwijderEnSluit(id: string) {
    this.verwijder(id);
    this.sluit();
  }


  public evenementAanmaken() {

    if (this.evenement.titel.trim()) {
      this.evenement.aangemaakt = Date.now();

      const fbEvent = this.evenementen.push(
        this.evenement
      );

      const key = fbEvent.key;
      this.evenement.id = key;
      this.evenementen.update(key, this.evenement);

    } else {
      this.alerts.push({
        type: 'danger',
        message: 'De titel van het evenement mag niet leeg zijn.'
      });
    }

    this.evenement.titel = '';
  }

  public sluitAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  private verwijder(id: string) {
    this.evenementen.remove(id).then(
      succes => {
        this.alerts.push({
          type: 'success',
          message: 'Het evenement werd succesvol verwijderd.'
        });
      },
      error => {
        this.alerts.push({
          type: 'danger',
          message: 'Het evenement kon niet worden verwijderd.'
        });
      },
    );

    this.sluit();
  }
}
