import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Gebruiker} from "../model/gebruiker";
import {ActivatedRoute} from "@angular/router";

interface InschrijvingViewModel {
  voornaam: string;
  achternaam: string;
  betaald: boolean;
}

@Component({
  selector: 'dzwelg-evenementen-bewerken',
  templateUrl: './evenementen-bewerken.component.html',
  styleUrls: ['./evenementen-bewerken.component.css']
})
export class EvenementenBewerkenComponent implements OnInit {

  id: string;
  gebruikers: FirebaseListObservable<Gebruiker[]>;
  ingeschrevenenFLO: FirebaseListObservable<any[]>;
  inschrijvingen: InschrijvingViewModel[] = [];

  constructor(private afdb: AngularFireDatabase, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.gebruikers = this.afdb.list('/gebruikers');
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.mapIngeschrevenen();
    });
  }

  public schrijfIn(id: string) {
    if (this.id) {
      this.afdb.object('/activiteiten/' + this.id + '/ingeschrevenen').update({[id]: false});
    }
  }

  private mapIngeschrevenen(): void {
    this.ingeschrevenenFLO = this.afdb.list('/activiteiten/' + this.id + '/ingeschrevenen');
    this.ingeschrevenenFLO.subscribe(ingeschrevenen => {
      this.inschrijvingen = [];
      ingeschrevenen.forEach(ingeschrevene => {
        const gebruikerSubscription = this.getGebruiker(ingeschrevene.$key).subscribe(
          (gebruiker) => {
            this.inschrijvingen.push({
              voornaam: gebruiker.voornaam,
              achternaam: gebruiker.achternaam,
              betaald: ingeschrevene.$value,
            });
            gebruikerSubscription.unsubscribe();
          },
          (error) => {},
          () => {
          }
          );
      });
    });
  }

  private getGebruiker(id: string) {
    return this.afdb.object('/gebruikers/' + id);
  }
}
