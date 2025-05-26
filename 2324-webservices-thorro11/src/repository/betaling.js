const { tables, getKnex } = require('../data/index'); // 👈 1

const SELECT_COLUMNS = [
  `${tables.betaling}.id`,
  `${tables.betaling}.betaalmethode`,
  `${tables.betaling}.bedrag`,
  `${tables.betaling}.reservatie_id`,
];

const findAllAdmin = async () => {
  return await getKnex()(tables.betaling).select();
};

const findAll = async (userId) => {
  return await getKnex()(tables.betaling)
    .join(
      tables.reservatie,
      `${tables.reservatie}.id`,
      '=',
      `${tables.betaling}.reservatie_id`
    )
    .select(SELECT_COLUMNS)
    .where(`${tables.reservatie}.user_id`, userId);
};

const create = async ({ id, bedrag, betaalmethode, reservatie_id }) => {
  const betaling = { id, bedrag, betaalmethode, reservatie_id };
  await getKnex()(tables.betaling).insert(betaling);
  await getKnex()(tables.reservatie)
    .where(`${tables.reservatie}.id`, reservatie_id)
    .update({
      status: 'betaald',
    });
  return await getKnex()(tables.betaling).select(SELECT_COLUMNS).where({ id }); 
};

module.exports = {
  findAllAdmin,
  findAll,
  create, // 👈 4
};
