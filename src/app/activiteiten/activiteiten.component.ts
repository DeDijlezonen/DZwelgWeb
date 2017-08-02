import {FormBuilder, Validators} from '@angular/forms';
import {Activiteit} from '../model/activiteit';
import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {IAlert} from './../model/alert';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

interface ActiviteitType {
  value: string;
  displayUpper: string;
  displayLower: string;
}

@Component({
  selector: 'dzwelg-evenementen',
  templateUrl: './activiteiten.component.html',
  styleUrls: ['./activiteiten.component.css']
})
export class ActiviteitenComponent implements OnInit {

  activiteiten: FirebaseListObservable<Activiteit[]>;
  alert: IAlert;
  verwijderModal: NgbModalRef;
  teVerwijderenActiviteitId: string;
  teVerwijderenActiviteit: FirebaseObjectObservable<Activiteit>;
  teBewerkenActiviteitId: string;

  bewerkForms = new Map();

  typeAanTeMakenActiviteit: ActiviteitType;
  activiteitTypes: ActiviteitType[] = [
    {value: 'prodcutie', displayUpper: 'Productie', displayLower: 'productie'},
    {value: 'evenement', displayUpper: 'Evenement', displayLower: 'evenement'}
  ];

  constructor(private afdb: AngularFireDatabase, private modalService: NgbModal, private fb: FormBuilder) {
    // this.typeAanTeMakenActiviteit = this.activiteitTypes.find(type => type.value === 'productie');
    // this.typeAanTeMakenActiviteit = { value: 'prodcutie', displayUpper: 'Productie', displayLower: 'productie' };
  }

  ngOnInit() {
    this.typeAanTeMakenActiviteit = this.activiteitTypes[0];
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

  public evenementBewerken(model: Activiteit, id: string) {
    this.activiteiten.update(id, {titel: model.titel});
    this.teBewerkenActiviteitId = '';
    this.alert = {
      type: 'success',
      message: 'De activiteit werd succesvol bewerkt.'
    };
  }

  private verwijder(id: string) {
    this.activiteiten.remove(id).then(
      succes => {
        this.alert = {
          type: 'success',
          message: 'De activiteit werd succesvol verwijderd.'
        };
      },
      error => {
        this.alert = {
          type: 'danger',
          message: 'De activiteit kon niet worden verwijderd. (' + error.name + ': ' + error.message + ')'
        };
      },
    );

    this.sluit();
  }
}
