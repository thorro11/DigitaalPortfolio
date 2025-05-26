const Router = require('@koa/router'); // 👈 1
const userService = require('../service/user');
const validate = require('../core/validation');
const Joi = require('joi');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

const getAllUsers = async (ctx) => {
  ctx.body = await userService.getAll();
};

getAllUsers.validationScheme = null;

const getUserPerId = async (ctx) => {
  ctx.body = await userService.getUser(Number(ctx.params.id));
};

getUserPerId.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const voegUserToe = async (ctx) => {
  const token = await userService.create(ctx.request.body);
  ctx.body = token;
  ctx.status = 200;
};

voegUserToe.validationScheme = {
  body: {
    voornaam: Joi.string(),
    achternaam: Joi.string(),
    telefoonnummer: Joi.string(),
    email: Joi.string().email(),
    geboortedatum: Joi.date().iso().max(new Date()),
    straat: Joi.string(),
    huisnummer: Joi.number(),
    postcode: Joi.number(),
    plaats: Joi.string(),
    land: Joi.string(),
    password: Joi.string().min(8).max(30),
  },
};

const wijzigUser = async (ctx) => {
  const gewijzigdeUser = await userService.wijzig({
    ...ctx.request.body,
    id: Number(ctx.params.id),
    voornaam: ctx.request.body.voornaam,
    achternaam: ctx.request.body.achternaam,
    telefoonnummer: ctx.request.body.telefoonnummer,
    email: ctx.request.body.email,
    straat: ctx.request.body.straat,
    huisnummer: ctx.request.body.huisnummer,
    postcode: ctx.request.body.postcode,
    plaats: ctx.request.body.plaats,
    land: ctx.request.body.land,
  });
  ctx.body = gewijzigdeUser;
};

wijzigUser.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
  body: {
    voornaam: Joi.string(),
    achternaam: Joi.string(),
    telefoonnummer: Joi.string(),
    email: Joi.string().email(),
    straat: Joi.string(),
    huisnummer: Joi.number(),
    postcode: Joi.number(),
    plaats: Joi.string(),
    land: Joi.string(),
  },
};

const verwijderUser = async (ctx) => {
  await userService.verwijder(Number(ctx.params.id));
  ctx.status = 204;
};

verwijderUser.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const token = await userService.login(email, password);
  ctx.body = token;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

const checkUserId = (ctx, next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      {
        code: 'FORBIDDEN',
      }
    );
  }
  return next();
};

module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });

  // Public routes
  router.post('/login', validate(login.validationScheme), login);
  router.post('/register', validate(voegUserToe.validationScheme), voegUserToe);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  // Routes with authentication/authorization
  router.get(
    '/',
    requireAuthentication,
    requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers
  );
  router.get(
    '/:id',
    requireAuthentication,
    validate(getUserPerId.validationScheme),
    checkUserId,
    getUserPerId
  );
  router.put(
    '/:id',
    requireAuthentication,
    validate(wijzigUser.validationScheme),
    checkUserId,
    wijzigUser
  );
  router.delete(
    '/:id',
    requireAuthentication,
    validate(verwijderUser.validationScheme),
    checkUserId,
    verwijderUser
  );

  app.use(router.routes()).use(router.allowedMethods());
};
