import {ActiviteitHelper} from '../utils/functions';

export class Activiteit {
    titel: string;
    id: string;

    starttijd: number;
    eindtijd: number;
    tegoed: number;

    actief: boolean;

    constructor() {
        this.titel = '';
        this.tegoed = 0;
        this.actief = true;
    }

    public isEvenement(): boolean {
      return ActiviteitHelper.isEvenement(this);
    }
}
