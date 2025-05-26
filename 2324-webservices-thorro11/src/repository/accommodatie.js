const { log } = require('winston');
const { tables, getKnex } = require('../data/index');
const ServiceError = require('../core/serviceError');

const SELECT_COLUMNS = [
  `${tables.accommodatie}.id`,
  'prijsPerNacht',
  'aantalPersonen',
  `${tables.accommodatie}.oppervlakte as oppervlakte_accommodatie`,
  'straat',
  'huisnummer',
  'postcode',
  'plaats',
  'land',
  `${tables.kamer}.id as k_id`,
  'aantalBedden',
  `${tables.kamer}.oppervlakte as oppervlakte_kamer`,
  `${tables.kamer}.accommodatie_id as aId_kamer`,
  `${tables.badkamer}.id as b_id`,
  'douche',
  'bad',
  'toilet',
  `${tables.badkamer}.oppervlakte as oppervlakte_badkamer`,
  `${tables.badkamer}.accommodatie_id as aId_badkamer`,
];

const formatAccommodatie = (
  {
    id,
    prijsPerNacht,
    aantalPersonen,
    oppervlakte,
    straat,
    huisnummer,
    postcode,
    plaats,
    land,
  },
  kamers,
  badkamers,
  voorzieningen
) => {
  const k = kamers.map(({ id, aantalBedden, oppervlakte }) => ({
    id,
    aantalBedden,
    oppervlakte,
  }));
  const b = badkamers.map(({ id, douche, bad, toilet, oppervlakte }) => ({
    id,
    douche,
    bad,
    toilet,
    oppervlakte,
  }));
  const v = voorzieningen.map(({ id, voorziening }) => ({
    id,
    voorziening,
  }));
  return {
    id,
    prijsPerNacht,
    aantalPersonen,
    oppervlakte,
    straat,
    huisnummer,
    postcode,
    plaats,
    land,
    kamers: k,
    badkamers: b,
    voorzieningen: v,
  };
};

const getAllKamers = async () => {
  return await getKnex()(tables.kamer).select();
};

const getAllBadkamers = async () => {
  return await getKnex()(tables.badkamer).select();
};

const getAllAccommodatievoorzieningen = async () => {
  return await getKnex()(tables.accommodatieVoorziening).select();
};

const findAll = async () => {
  const a = await getKnex()(tables.accommodatie)
    .join(
      tables.kamer,
      `${tables.accommodatie}.id`,
      '=',
      `${tables.kamer}.accommodatie_id`
    )
    .join(
      tables.badkamer,
      `${tables.accommodatie}.id`,
      '=',
      `${tables.badkamer}.accommodatie_id`
    )
    .select(SELECT_COLUMNS);
  const a1 = a.map(
    ({
      id,
      prijsPerNacht,
      aantalPersonen,
      oppervlakte_accommodatie,
      straat,
      huisnummer,
      postcode,
      plaats,
      land,
    }) => ({
      id,
      prijsPerNacht,
      aantalPersonen,
      oppervlakte: oppervlakte_accommodatie,
      straat,
      huisnummer,
      postcode,
      plaats,
      land,
    })
  );
  let ids = [];
  const accommodaties = a1.filter((a) => {
    if (!ids.includes(a.id)) {
      ids.push(a.id);
      return a;
    }
  });

  ids = [];
  const kamers1 = a.map(
    ({ k_id, aId_kamer, aantalBedden, oppervlakte_kamer }) => ({
      id: k_id,
      accommodatie_id: aId_kamer,
      aantalBedden,
      oppervlakte: oppervlakte_kamer,
    })
  );
  const kamers = kamers1.filter((k) => {
    if (!ids.includes(k.id)) {
      ids.push(k.id);
      return k;
    }
  });

  ids = [];
  const badkamers1 = a.map(
    ({ b_id, aId_badkamer, douche, bad, toilet, oppervlakte_badkamer }) => ({
      id: b_id,
      accommodatie_id: aId_badkamer,
      douche,
      bad,
      toilet,
      oppervlakte: oppervlakte_badkamer,
    })
  );
  const badkamers = badkamers1.filter((b) => {
    if (!ids.includes(b.id)) {
      ids.push(b.id);
      return b;
    }
  });

  const voorzieningen = await getKnex()(
    tables.accommodatieVoorziening
  ).select();

  let res = [];
  accommodaties.forEach((a) => {
    const k = kamers.filter(({ accommodatie_id }) => accommodatie_id === a.id);
    const b = badkamers.filter(
      ({ accommodatie_id }) => accommodatie_id === a.id
    );
    const v = voorzieningen.filter(
      ({ accommodatie_id }) => accommodatie_id === a.id
    );
    res.push(formatAccommodatie(a, k, b, v));
  });
  return res;
};

const findById = async (id) => {
  const accommodatie = (
    await getKnex()(tables.accommodatie)
      .select()
      .where(`${tables.accommodatie}.id`, id)
  )[0];

  if (!accommodatie) {
    throw ServiceError.notFound(`No accommodation with id ${id} exists`, {
      id,
    });
  }

  const kamers = await getKnex()(tables.kamer)
    .select()
    .where(`${tables.kamer}.accommodatie_id`, id);
  const badkamers = await getKnex()(tables.badkamer)
    .select()
    .where(`${tables.badkamer}.accommodatie_id`, id);
  const voorzieningen = await getKnex()(tables.accommodatieVoorziening)
    .select()
    .where(`${tables.accommodatieVoorziening}.accommodatie_id`, id);
  return formatAccommodatie(accommodatie, kamers, badkamers, voorzieningen);
};

// const findById = async (id) => {
//   return await getKnex()(tables.accommodatie)
//     .select()
//     .where(`${tables.accommodatie}.id`, id);
// };

const create = async (accommodatie, kamers, badkamers, voorzieningen) => {
  const [id] = await getKnex()(tables.accommodatie).insert(accommodatie);
  await getKnex()(tables.kamer).insert(kamers);
  await getKnex()(tables.badkamer).insert(badkamers);
  await getKnex()(tables.accommodatieVoorziening).insert(voorzieningen);
  return id;
};

const deleteById = async (
  id,
  kamersToDelete,
  badkamersToDelete,
  voorzieningenToDelete
) => {
  await getKnex()(tables.accommodatie).where({ id }).delete();
  await getKnex()(tables.kamer).whereIn('id', kamersToDelete).delete();
  await getKnex()(tables.badkamer).whereIn('id', badkamersToDelete).delete();
  await getKnex()(tables.accommodatieVoorziening)
    .whereIn('id', voorzieningenToDelete)
    .delete();
};

module.exports = {
  findAll,
  findById,
  create,
  deleteById,
  getAllKamers,
  getAllAccommodatievoorzieningen,
  getAllBadkamers,
};
