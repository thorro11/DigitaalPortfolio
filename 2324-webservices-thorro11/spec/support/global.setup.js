const config = require('config');
const { initializeLogger } = require('../../src/core/logging');
const Role = require('../../src/core/roles');
const { initializeData, getKnex, tables } = require('../../src/data');

module.exports = async () => {
  // Create a database connection
  initializeLogger({
    level: config.get('log.level'),
    disabled: config.get('log.disabled'),
  });

  // Insert a test user with password 12345678
  const knex = getKnex();
  await knex(tables.user).insert([
    {
      id: 1,
      voornaam: 'Test',
      achternaam: 'Admin',
      telefoonnummer: '0470149180',
      email: 'test.admin@student.hogent.be',
      geboortedatum: new Date('2004-01-04'),
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
      voornaam: 'Test',
      achternaam: 'User',
      telefoonnummer: '0470346152',
      email: 'test.user@gmail.com',
      geboortedatum: new Date('1967-04-21'),
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
};
