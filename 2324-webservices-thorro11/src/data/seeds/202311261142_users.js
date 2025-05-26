const { tables } = require('..');
const Role = require('../../core/roles');

module.exports = {
  seed: async (knex) => {
    await knex(tables.user).delete(); 

    await knex(tables.user).insert([
      {
        id: 1,
        voornaam: 'Thor',
        achternaam: 'Cornelis',
        telefoonnummer: '0470149180',
        email: 'thor.cornelis@student.hogent.be',
        geboortedatum: '2004-01-04',
        straat: 'Sint-Pietersnieuwstraat',
        huisnummer: 130,
        postcode: 9000,
        plaats: 'Gent',
        land: 'België',
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
      },
      {
        id: 2,
        voornaam: 'Jos',
        achternaam: 'Vermeers',
        telefoonnummer: '0470346152',
        email: 'jos.vermeers@gmail.com',
        geboortedatum: '1967-04-21',
        straat: 'Haanhoutstraat',
        huisnummer: 52,
        postcode: 9080,
        plaats: 'Lochristi',
        land: 'België',
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.USER]),
      },
    ]);
  },
};
