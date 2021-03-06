import {FormBuilder, Validators} from '@angular/forms';
import {Activiteit} from '../model/activiteit';
import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {IAlert} from './../model/alert';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DateHelper} from '../utils/functions';
import {Router} from '@angular/router';

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
  activiteitenVoorView: Activiteit[] = [];
  inactieveActiviteitenVoorView: Activiteit[] = [];
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

  constructor(private afdb: AngularFireDatabase, private router: Router, private modalService: NgbModal, private fb: FormBuilder) {
    // this.typeAanTeMakenActiviteit = this.activiteitTypes.find(type => type.value === 'productie');
    // this.typeAanTeMakenActiviteit = { value: 'prodcutie', displayUpper: 'Productie', displayLower: 'productie' };
  }

  ngOnInit() {
    this.typeAanTeMakenActiviteit = this.activiteitTypes[0];
    this.activiteiten = this.afdb.list('activiteiten');
    this.activiteiten.subscribe(snapshots => {
      this.activiteitenVoorView = snapshots.filter(activiteit => activiteit.actief);
      this.inactieveActiviteitenVoorView = snapshots.filter(activiteit => !activiteit.actief);
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

  public naarActiviteitBewerken(activiteit): void {
    this.teBewerkenActiviteitId = '';

    this.router.navigate(['/activiteiten/bewerken', activiteit.id]);
  }

  public getDateFromMiliSeconds(seconds: number) {
    return DateHelper.getDateFromMiliSeconds(seconds);
  }

  private verwijder(id: string) {
    this.activiteiten.update(id, {actief: false}).then(
      succes => {
        this.alert = {
          type: 'success',
          message: 'De activiteit werd succesvol gedesactiveerd.'
        };
      },
      error => {
        this.alert = {
          type: 'danger',
          message: 'De activiteit kon niet worden gedesactiveerd. (' + error.name + ': ' + error.message + ')'
        };
      },
    );

    this.sluit();
  }
}
