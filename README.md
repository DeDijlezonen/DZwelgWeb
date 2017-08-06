# DzwelgWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.1.

## Environments
Op Firebase zijn er twee verschillende projecten (DZwelg en DZwelg-dev). De redenen hiervoor zouden vanzelfsprekend moeten zijn.

###### vs angular
Om dit te laten werken i.f.v. het builden en runnen van code zijn er in `src/environments/` twee ts-bestanden die respectievelijk het `firebaseConfig` object opvullen met de correcte waarden.
 - `environment.prod.ts` - verbindt met DZwelg (productieserver)
 - `environment.ts` - verbindt met DZwelg-dev (ontwikkelingsserver)
 
De omgeving kan ingesteld worden bij het builden door het --environment argument:
```bash
ng build --environment=prod
ng build --environment=dev
```
Indien geen omgeving gespecifieerd, zal de dev-environment gebruikt worden.

###### vs firebase
Projectinfo van beide projecten staat in firebase.json. Standaard probeert firebase te verbinden met het dev project, m.a.w. het commando
`firebase deploy`
zal deployen naar dzwelg-dev (ontwikkelingsserver).

Overschakelen naar dzwelg (productieserver) gaat met volgend commando:
```bash
firebase use production
```
Om terug te schakelen naar dzwelg-dev:
```bash
firebase use default
```


## Firebase Admin SDK private keys
Om aan gebruikersbeheer te doen, gebruiken we de Admin SDK van Firebase (https://firebase.google.com/docs/admin/setup).

Om dit te laten werken, zijn volgende bestanden nodig (één voor elke environment): 
```
src/json/dzwelg-dev-firebase-adminsdk-twu6z-5c19432620.json
TODO
```
Dit zijn de private keys die de Firebase service account toegang geeft om via de Admin SDK administratieve functies uit te voeren op het project.
Om beveiligingsredenen zijn deze bestanden niet ingechecked op de git. Beide bestanden staand op de Google Drive van ktdijlezonen@gmail.com. 
