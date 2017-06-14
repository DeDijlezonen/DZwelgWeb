import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  alert: IAlert;
  evenement: Evenement = new Evenement();
  verwijderModal: NgbModalRef;
  teVerwijderenEvenementId: string;
  teBewerkenEvenementId: string;

  bewerkForms = new Map();

  constructor(private afdb: AngularFireDatabase, private modalService: NgbModal, private fb: FormBuilder) {
    // this.createBewerkForm();
  }

  ngOnInit() {
    this.evenementen = this.afdb.list('evenementen');
    this.evenementen.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.bewerkForms.set(
          snapshot.id,
          this.fb.group({
            titel: [snapshot.titel, Validators.required]
          })
        );
      });
    });
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
      this.alert = {
        type: 'danger',
        message: 'De titel van het evenement mag niet leeg zijn.'
      };
    }

    this.evenement.titel = '';
  }

  public evenementBewerken(model: Evenement, id: string) {
    this.evenementen.update(id, { titel: model.titel });
    this.teBewerkenEvenementId = '';
    this.alert = {
      type: 'success',
      message: 'Het evenement werd succesvol bewerkt.'
    }
  }

  private verwijder(id: string) {
    this.evenementen.remove(id).then(
      succes => {
        this.alert = {
          type: 'success',
          message: 'Het evenement werd succesvol verwijderd.'
        };
      },
      error => {
        this.alert = {
          type: 'danger',
          message: 'Het evenement kon niet worden verwijderd.'
        };
      },
    );

    this.sluit();
  }
}
