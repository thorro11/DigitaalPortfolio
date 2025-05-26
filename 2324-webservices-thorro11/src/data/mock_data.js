let BETALINGEN = [
  {
    id: 1,
    bedrag: 600.0,
    betaalmethode: 'paypal',
  },
  {
    id: 2,
    bedrag: 360.0,
    betaalmethode: 'bancontact',
  },
];

let RESERVATIES = [
  {
    id: 1,
    begindatum: new Date('2024-07-11'),
    einddatum: new Date('2024-07-21'),
    datum: new Date('2023-10-27'),
    aantalPersonen: 6,
    betaling: {
      id: 1,
      bedrag: 600.0,
      betaalmethode: 'paypal',
    },
  },
  {
    id: 2,
    begindatum: new Date('2024-06-15'),
    einddatum: new Date('2024-06-21'),
    datum: new Date('2023-10-29'),
    aantalPersonen: 4,
    betaling: {
      id: 2,
      bedrag: 360.0,
      betaalmethode: 'bancontact',
    },
  },
];

let ACCOMMODATIES = [
  {
    id: 1,
    prijsPerNacht: 60.0,
    aantalPersonen: 6,
    oppervlakte: '280 m2',
    straat: 'Boskuiter',
    huisnummer: '22',
    postcode: '9690',
    plaats: 'Kluisbergen',
    land: 'België',
    reservaties: [
      {
        id: 1,
        begindatum: new Date('2024-07-11'),
        einddatum: new Date('2024-07-21'),
        datum: new Date('2023-10-27'),
        aantalPersonen: 6,
        betaling: {
          id: 1,
          bedrag: 600.0,
          betaalmethode: 'paypal',
        },
      },
      {
        id: 2,
        begindatum: new Date('2024-06-15'),
        einddatum: new Date('2024-06-21'),
        datum: new Date('2023-10-29'),
        aantalPersonen: 4,
        betaling: {
          id: 2,
          bedrag: 360.0,
          betaalmethode: 'bancontact',
        },
      },
    ],
    kamers: [
      {
        id: 1,
        aantalBedden: 2,
        oppervlakte: '12 m2',
      },
    ],
    badkamers: [
      {
        id: 1,
        douche: 1,
        bad: 1,
        toilet: 0,
        oppervlakte: '10 m2',
      },
    ],
    voorzieningen: [
      {
        soort: 'WIFI',
      },
      {
        soort: 'Wasmachine',
      },
    ],
  },
];

let USERS = [
  {
    id: 1,
    voornaam: 'Jos',
    achternaam: 'Vermeers',
    telefoonnummer: '0470346152',
    email: 'jos.vermeers@gmail.com',
    geboortedatum: new Date('1967-04-21'),
    straat: 'Haanhoutstraat',
    huisnummer: 52,
    postcode: 9080,
    plaats: 'Lochristi',
    land: 'België',
    reservaties: [
      {
        id: 1,
        begindatum: new Date('2024-07-11'),
        einddatum: new Date('2024-07-21'),
        datum: new Date('2023-10-27'),
        aantalPersonen: 6,
        betaling: {
          id: 1,
          bedrag: 600.0,
          betaalmethode: 'paypal',
        },
      },
    ],
  },
];

let KAMERS = [
  {
    id: 1,
    aantalBedden: 2,
    oppervlakte: '12 m2',
  },
];

let BADKAMERS = [
  {
    id: 1,
    douche: 1,
    bad: 1,
    toilet: 0,
    oppervlakte: '10 m2',
  },
];

let VOORZIENINGEN = [
  {
    soort: 'WIFI',
  },
  {
    soort: 'Wasmachine',
  },
  {
    soort: 'Vaatwas',
  },
];

module.exports = { BETALINGEN, RESERVATIES, ACCOMMODATIES, USERS };
