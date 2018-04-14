import {Actief} from "./actief";

export interface Consumptie extends Actief {
  id: string;
  naam: string;
  prijs: number;
  stocklijnId: string;
}
