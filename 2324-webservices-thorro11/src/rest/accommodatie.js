const Router = require('@koa/router');
const accommodatieService = require('../service/accommodatie');
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

const getAll = async (ctx) => {
  const accommodaties = await accommodatieService.getAll();
  ctx.body = accommodaties;
};

getAll.validationScheme = null;

const getById = async (ctx) => {
  const accommodatie = await accommodatieService.getAccommodatie(
    Number(ctx.params.id)
  );
  ctx.body = accommodatie;
};

getById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const voegAccommodatieToe = async (ctx) => {
  const accommodatie = await accommodatieService.create(ctx.request.body);
  ctx.body = accommodatie;
};

const verwijderAccommodatie = async (ctx) => {
  await accommodatieService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

verwijderAccommodatie.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

module.exports = (app) => {
  const router = new Router({ prefix: '/accommodaties' });

  router.get('/', validate(getAll.validationScheme), getAll);
  router.get('/:id', validate(getById.validationScheme), getById);
  router.post(
    '/',
    requireAuthentication,
    makeRequireRole(Role.ADMIN),
    voegAccommodatieToe
  );
  router.delete(
    '/:id',
    requireAuthentication,
    makeRequireRole(Role.ADMIN),
    validate(verwijderAccommodatie.validationScheme),
    verwijderAccommodatie
  );

  app.use(router.routes()).use(router.allowedMethods());
};
