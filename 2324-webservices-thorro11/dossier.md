# Thor Cornelis (202290771)

- [x] Web Services:
  - <https://github.com/Web-IV/2324-webservices-thorro11.git>
  - <https://webservices-project-thorcornelis.onrender.com>

**Logingegevens**

- Admin

  - Gebruikersnaam/e-mailadres: <test.admin@student.hogent.be>
  - Wachtwoord: 12345678

## Projectbeschrijving

Ik heb een api gebouwd die toelaat dat een gebruiker een (vakentie)verblijf kan boeken voor een bepaalde periode. 

![ERD](./Schermafbeelding%202023-12-20%20om%2021.15.02.png)

## API calls

### Gebruikers

- `GET /api/users`: alle gebruikers ophalen
- `GET /api/users/:id`: gebruiker met een bepaald id ophalen
- `POST /api/users/login`: inloggen
- `POST /api/users/login`: registreren
- `PUT /api/users/:id`: gegevens wijzigen van de ingelogde gebruiker
- `DELETE /api/users/:id`: gebruiker kan zijn account verwijderen

### Reservaties

- `GET /api/reservaties`: een gebruiker kan al zijn reservaties raadplegen
- `GET /api/reservaties/:id`: een gebruiker kan een bepaalde reservatie opzoeken
- `POST /api/reservaties`: een gebruiker kan een accommodatie boeken
- `PUT /api/reservaties/:id`: een gebruiker kan een bepaalde reservatie wijzigen
- `DELETE /api/reservaties/:id`: een gebruiker kan een bepaalde reservatie verwijderen

### Betalingen

- `GET /api/betalingen`: een gebruiker kan al zijn betalingen raadplegen
- `POST /api/betalingen`: een gebruiker kan zijn reservatie betalen

### Accommodaties

- `GET /api/accommodaties`: iedereen kan alle accommodaties zien
- `GET /api/accommodaties/:id`: iedereen kan een bepaalde accommodatie opzoeken
- `POST /api/accommodaties`: de admin kan een accommodatie toevoegen
- `DELETE /api/accommodaties/:id`: de admin kan een accommodatie verwijderen

## Behaalde minimumvereisten

### Web Services

- **datalaag**

  - [x] voldoende complex (meer dan één tabel, 2 een-op-veel of veel-op-veel relaties)
  - [x] één module beheert de connectie + connectie wordt gesloten bij sluiten server
  - [x] heeft migraties - indien van toepassing
  - [x] heeft seeds
        <br />

- **repositorylaag**

  - [x] definieert één repository per entiteit (niet voor tussentabellen) - indien van toepassing
  - [x] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing
        <br />

- **servicelaag met een zekere complexiteit**

  - [x] bevat alle domeinlogica
  - [x] bevat geen SQL-queries of databank-gerelateerde code
        <br />

- **REST-laag**

  - [x] meerdere routes met invoervalidatie
  - [x] degelijke foutboodschappen
  - [x] volgt de conventies van een RESTful API
  - [x] bevat geen domeinlogica
  - [x] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bvb tussentabellen)
  - [x] degelijke authorisatie/authenticatie op alle routes
        <br />

- **algemeen**

  - [x] er is een minimum aan logging voorzien
  - [ ] een aantal niet-triviale integratietesten (min. 1 controller >=80% coverage)
  - [x] minstens één extra technologie
  - [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
  - [x] duidelijke en volledige README.md
  - [x] volledig en tijdig ingediend dossier en voldoende commits

## Projectstructuur

### Web Services

Ik heb drie hoofdmappen namelijk config, src, en spec. In de map config zitten al mijn configuratiebestanden. De src map bevat de meeste bestanden. Deze map is nog is onderverdeeld in de mappen core, data, repository, rest en service. Tot slot blijft nog de map spec over. Deze bevat mijn testconfiguratie en al mijn testbestanden.

## Extra technologie

### Web Services

Ik heb een andere test library gebruikt. Ik heb gekozen voor Jasmine. De Jasmine configuratie verschilt met die van Jest en ik heb ook mijn package.json moeten aanpassen.

<https://www.npmjs.com/package/jasmine>

## Testresultaten

### Web Services

Ik heb al mijn endpoints getest. Ik heb niet alleen getest of een request lukt, maar ik heb ook getest of ik de juiste foutboodschappen ontvang waar nodig. Bij `POST` en `PUT` requests heb ik goed gecontroleerd of ik alle nodige informatie meekrijg in de body. Ik heb ook getest op authenticaite.

![testen](./Schermafbeelding%202023-12-20%20om%2022.00.37.png)

## Gekende bugs

### Web Services

- Als de termijn van een reservatie wordt gewijzigd, klopt het betaalde bedrag niet meer.

## Wat is er verbeterd/aangepast?

> Deze sectie is enkel voor 2e zittijd, verwijder deze in 1e zittijd.

### Web Services

- Oh en dit ook
