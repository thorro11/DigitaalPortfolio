const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.accommodatie, (table) => {
      table.increments('id'); // 👈 1
      table.decimal('prijsPerNacht', 10, 2).notNullable();
      table.integer('aantalPersonen').notNullable();
      table.string('oppervlakte', 10).notNullable();
      table.string('straat', 255).notNullable();
      table.integer('huisnummer').notNullable();
      table.integer('postcode').notNullable();
      table.string('plaats', 255).notNullable();
      table.string('land', 255).notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.accommodatie);
  },
};
