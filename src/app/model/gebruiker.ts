export interface Gebruiker {
  /**
   * @deprecated Vanaf nu wordt UID gebruikt, gezien dit het UID is van de gebruiker in het Firebase controlepaneel.
   * id bestaat nog voor compatibiliteit, maar wordt niet meer gebruikt!
   */
  id: string;
  uid: string;
    voornaam: string;
    achternaam: string;
  /**
   * @deprecated Gezien gebruikers nu Firebase gebruikers zijn, staat hun emailadres in het Firebase controlepaneel
   * en is het niet meer nodig deze in de database op te slagen
   */
  email: string;
    saldo: number;
    rollen: { [rolnaam: string]: boolean };
}
