const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.voorziening, (table) => {
      table.string('soort', 255).notNullable();

      table.primary('soort');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.voorziening);
  },
};
