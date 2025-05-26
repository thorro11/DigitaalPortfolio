const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.accommodatie).delete(); // 👈 2

    await knex(tables.accommodatie).insert([
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
      },
    ]); 
  },
};
