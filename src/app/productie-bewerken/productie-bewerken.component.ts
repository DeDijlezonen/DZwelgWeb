import { Component, OnInit } from '@angular/core';
import {IAlert} from "../model/alert";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireDatabase} from "angularfire2/database";
import {Activiteit} from "../model/activiteit";
import {FormHelper} from "../utils/functions";

@Component({
  selector: 'dzwelg-productie-bewerken',
  templateUrl: './productie-bewerken.component.html',
  styleUrls: ['./productie-bewerken.component.css']
})
export class ProductieBewerkenComponent implements OnInit {

  id: string;
  alert: IAlert;
  productieBewerkenForm: FormGroup;

  constructor(private afdb: AngularFireDatabase, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.createForm();
    });

  }

  public createForm() {
    this.getProductie().subscribe(productie => {
      this.productieBewerkenForm = this.fb.group({
        titel: [productie.titel, Validators.required],
      });
    });
  }

  private getProductie() {
    if (this.id) {
      return this.afdb.object('/activiteiten/' + this.id);
    }
  }

  public productieBewerkenOpslaan(model: Activiteit) {
    if (this.productieBewerkenForm.invalid) {
      const foutBoodschap = FormHelper.getFormErrorMessage(this.productieBewerkenForm);

      this.alert = {
        type: 'danger',
        message: foutBoodschap,
      };
    } else {

      if (this.id) {
        this.afdb.object('/activiteiten/' + this.id).update(model);

        this.router.navigate(['/activiteiten']);
      }
    }
  }
}
