const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.user, (table) => {
      table.increments('id'); // 👈 1
      table.string('voornaam', 255).notNullable();
      table.string('achternaam', 255).notNullable();
      table.string('telefoonnummer', 255).notNullable();
      table.string('email', 255).notNullable();
      table.dateTime('geboortedatum').notNullable();
      table.string('straat', 255).notNullable();
      table.integer('huisnummer').notNullable();
      table.integer('postcode').notNullable();
      table.string('plaats', 255).notNullable();
      table.string('land', 255).notNullable();

      table.unique('telefoonnummer', 'idx_user_telefoonnummer_unique');
      table.unique('email', 'idx_user_email_unique');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.user);
  },
};
