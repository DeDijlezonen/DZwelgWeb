import { IAlert } from './../model/alert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Lid } from './../model/lid';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dzwelg-leden',
  templateUrl: './leden.component.html',
  styleUrls: ['./leden.component.css']
})
export class LedenComponent implements OnInit {

  leden: FirebaseListObservable<Lid[]>;
  lidAanmakenModal: NgbModalRef;
  lidAanmakenFormGroup: FormGroup;
  teVerwijderenLidId: string;
  teVerwijderenLid: FirebaseObjectObservable<Lid>;
  verwijderLidModal: NgbModalRef;
  alert: IAlert;

  constructor(private afdb: AngularFireDatabase, private modalService: NgbModal, private fb: FormBuilder) { }

  ngOnInit() {
    this.leden = this.afdb.list('leden');
    this.createLidAanmakenForm();
  }

  createLidAanmakenForm() {
    this.lidAanmakenFormGroup = this.fb.group({
      voornaam: ['', Validators.required],
      achternaam: ['', Validators.required],
      saldo: [0, Validators.required]
    });
  }

  openLidAanmakenModal(content) {
    this.lidAanmakenModal = this.modalService.open(content);
  }

  sluitLidAanmakenModal() {
    this.lidAanmakenModal.close();
    this.lidAanmakenFormGroup.reset();
  }

  lidAanmaken(model: Lid) {
    this.leden.push({
      voornaam: model.voornaam,
      achternaam: model.achternaam,
      saldo: model.saldo,
    });
    this.sluitLidAanmakenModal();
    this.lidAanmakenFormGroup.reset();
  }

  openLidVerwijderenModel(content, id: string) {
    this.teVerwijderenLidId = id;
    this.teVerwijderenLid = this.afdb.object('/leden/' + id);
    this.verwijderLidModal = this.modalService.open(content);
  }

  sluitVerwijderLidModal() {
    this.teVerwijderenLidId = '';
    this.teVerwijderenLid = null;
    this.verwijderLidModal.close();
  }

  verwijderLidEnSluit(id: string) {
    this.lidVerwijderen(id);
    this.sluitVerwijderLidModal();
  }

  lidVerwijderen(id: string) {
    this.leden.remove(id).then(
      succes => {
        this.alert = {
          type: 'success',
          message: 'Het lid werd succesvol verwijderd.'
        };
      },
      error => {
        this.alert = {
          type: 'danger',
          message: 'Het lid kon niet worden verwijderd.'
        };
      },
    );
  }
}
