const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.user, (table) => {
      table.string('password_hash').notNullable(); // 👈 2
      table.jsonb('roles').notNullable(); // 👈 2

    });
  },
  down: (knex) => {
    // 👇 4
    return knex.schema.alterTable(tables.user, (table) => {
      table.dropColumns('password_hash', 'roles');
    });
  },
};
