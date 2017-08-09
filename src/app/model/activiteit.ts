export class Activiteit {
    titel: string;
    id: string;

    starttijd: number;
    eindtijd: number;
    tegoed: number;

    constructor() {
        this.titel = '';
        this.tegoed = 0;
    }

    public isEvenement(): boolean {
      if (this.hasOwnProperty('eindtijd') && this.hasOwnProperty('tegoed')) {
        return true;
      }
      return false;
    }
}
