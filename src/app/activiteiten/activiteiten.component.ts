import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Activiteit } from '../model/activiteit';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { IAlert } from './../model/alert';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dzwelg-evenementen',
  templateUrl: './activiteiten.component.html',
  styleUrls: ['./activiteiten.component.css']
})
export class ActiviteitenComponent implements OnInit {

  activiteiten: FirebaseListObservable<Activiteit[]>;
  alert: IAlert;
  activiteit: Activiteit = new Activiteit();
  verwijderModal: NgbModalRef;
  teVerwijderenActiviteitId: string;
  teVerwijderenActiviteit: FirebaseObjectObservable<Activiteit>;
  teBewerkenActiviteitId: string;

  bewerkForms = new Map();

  constructor(private afdb: AngularFireDatabase, private modalService: NgbModal, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.activiteiten = this.afdb.list('activiteiten');
    this.activiteiten.subscribe(snapshots => {
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
    this.teVerwijderenActiviteitId = id;
    this.teVerwijderenActiviteit = this.afdb.object('/activiteiten/' + this.teVerwijderenActiviteitId);
    this.verwijderModal = this.modalService.open(content);
  }

  public sluit() {
    this.teVerwijderenActiviteitId = '';
    this.teVerwijderenActiviteit = null;
    this.verwijderModal.close();
  }

  public verwijderEnSluit(id: string) {
    this.verwijder(id);
    this.sluit();
  }


  public evenementAanmaken() {

    if (this.activiteit.titel.trim()) {
      this.activiteit.aangemaakt = Date.now();

      const fbEvent = this.activiteiten.push(
        this.activiteit
      );

      const key = fbEvent.key;
      this.activiteit.id = key;
      this.activiteiten.update(key, this.activiteit);

    } else {
      this.alert = {
        type: 'danger',
        message: 'De titel van het activiteit mag niet leeg zijn.'
      };
    }

    this.activiteit.titel = '';
  }

  public evenementBewerken(model: Activiteit, id: string) {
    this.activiteiten.update(id, { titel: model.titel });
    this.teBewerkenActiviteitId = '';
    this.alert = {
      type: 'success',
      message: 'Het activiteit werd succesvol bewerkt.'
    }
  }

  private verwijder(id: string) {
    this.activiteiten.remove(id).then(
      succes => {
        this.alert = {
          type: 'success',
          message: 'Het activiteit werd succesvol verwijderd.'
        };
      },
      error => {
        this.alert = {
          type: 'danger',
          message: 'Het evenements kon niet worden verwijderd. (' + error.name + ': ' + error.message + ')'
        };
      },
    );

    this.sluit();
  }
}
