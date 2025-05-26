const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index'); // 👈 1

const SELECT_COLUMNS = [
  `${tables.user}.id`,
  `${tables.user}.voornaam`,
  `${tables.user}.achternaam`,
  `${tables.user}.email`,
  `${tables.user}.telefoonnummer`,
  `${tables.user}.geboortedatum`,
  `${tables.user}.straat`,
  `${tables.user}.huisnummer`,
  `${tables.user}.postcode`,
  `${tables.user}.plaats`,
  `${tables.user}.land`,
  `${tables.user}.roles`,
];

const findAll = async () => {
  return await getKnex()(tables.user)
    .select(SELECT_COLUMNS)
    .orderBy('achternaam', 'ASC');
};

const findById = async (id) => {
  return await getKnex()(tables.user)
    .select(SELECT_COLUMNS)
    .where(`${tables.user}.id`, id);
};

const create = async (user) => {
  try {
    const id = (
      await getKnex()(tables.user).insert({
        id: user.id,
        voornaam: user.voornaam,
        achternaam: user.achternaam,
        telefoonnummer: user.telefoonnummer,
        email: user.email,
        geboortedatum: user.geboortedatum,
        straat: user.straat,
        huisnummer: user.huisnummer,
        postcode: user.postcode,
        plaats: user.plaats,
        land: user.land,
        password_hash: user.password_hash,
        roles: JSON.stringify(user.roles),
      })
    )[0];
    return id;
  } catch (error) {
    getLogger().error('Error in create', { error });
    throw error;
  }
};

const updateById = async ({
  id,
  telefoonnummer,
  email,
  straat,
  huisnummer,
  postcode,
  plaats,
  land,
  password_hash,
}) => {
  const user = {
    telefoonnummer,
    email,
    straat,
    huisnummer,
    postcode,
    plaats,
    land,
    password_hash,
  };
  await getKnex()(tables.user).where({ id }).update(user);
  return id;
};

const deleteById = async (id) => {
  await getKnex()(tables.user).where({ id }).delete();
};

const findByEmail = (email) => {
  return getKnex()(tables.user).where('email', email).first();
};

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
  findByEmail,
};
