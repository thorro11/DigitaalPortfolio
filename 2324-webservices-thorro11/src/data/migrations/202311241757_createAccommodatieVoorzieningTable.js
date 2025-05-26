const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.accommodatieVoorziening, (table) => {
      table.integer('id').unsigned().notNullable();
      table.integer('accommodatie_id').unsigned().notNullable();
      table.string('voorziening',255).notNullable();

      table.primary('id');
      table
        .foreign('accommodatie_id', 'fk_accommodatieVoorziening_accommodatie')
        .references('id')
        .inTable(tables.accommodatie)
        .onDelete('CASCADE');
      table
        .foreign('voorziening', 'accommodatieVoorziening_voorziening')
        .references('soort')
        .inTable(tables.voorziening)
        .onDelete('CASCADE');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.accommodatieVoorziening);
  },
};
