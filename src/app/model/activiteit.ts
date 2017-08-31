import {ActiviteitHelper} from "../utils/functions";

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
      return ActiviteitHelper.isEvenement(this);
    }
}
