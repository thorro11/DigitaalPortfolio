const { errorMonitor } = require('koa');
const reservatieRepository = require('../repository/reservatie');
const accommodatieRepository = require('../repository/accommodatie');
const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');

const getAll = async (userId) => {
  const reservaties = await reservatieRepository.findAll(userId);
  return { reservaties, aantal: reservaties.length };
};

const getReservatie = async (id, userId) => {
  const reservatie = await reservatieRepository.findById(id);

  if (!reservatie || reservatie.user_id !== userId) {
    throw ServiceError.notFound(`No reservation with id ${id} exists`, { id });
  }

  return reservatie;
};

// in orde
const create = async ({ begindatum, einddatum, aantalPersonen, uId, aId }) => {
  const accommodatie = await accommodatieRepository.findById(aId);

  if (begindatum > einddatum) {
    throw ServiceError.validationFailed(
      'Begindatum must be lower than einddatum',
      { begindatum, einddatum }
    );
  }

  const reservaties = (await getAll(uId)).reservaties;
  let maxId;
  if (reservaties.length === 0) {
    maxId = 0;
  } else {
    maxId = Math.max(...reservaties.map(({ id }) => id));
  }

  const nieuweReservatie = {
    id: maxId + 1,
    begindatum,
    einddatum,
    datum: new Date(),
    aantalPersonen,
    status: 'onbetaald',
    user_id: uId,
    accommodatie_id: aId,
  };

  try {
    const r = await reservatieRepository.create(nieuweReservatie);
    return r;
  } catch (error) {
    throw handleDBError(error);
  }
};

const wijzig = async ({
  id,
  begindatum,
  einddatum,
  aantalPersonen,
  user_id,
}) => {
  if (begindatum > einddatum) {
    throw ServiceError.validationFailed(
      'Begindatum must be lower than einddatum',
      { begindatum, einddatum }
    );
  }

  const reservatie = {
    id,
    begindatum,
    einddatum,
    aantalPersonen,
    user_id,
  };

  try {
    await reservatieRepository.updateById(reservatie);
    return getReservatie(id, user_id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// in orde
const annuleer = async (id, userId) => {
  try {
    const deleted = await reservatieRepository.deleteById(id, userId);
    if (!deleted) {
      throw ServiceError.notFound(`No reservation with id ${id} exists`, {
        id,
      });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getReservatie,
  create,
  wijzig,
  annuleer,
};
