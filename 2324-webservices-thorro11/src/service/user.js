const { errorMonitor } = require('koa');
const userRepository = require('../repository/user');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
const { hashPassword, verifyPassword } = require('../core/password');
const Role = require('../core/roles');
const { generateJWT, verifyJWT } = require('../core/jwt');
const config = require('config');
const { getLogger } = require('../core/logging');


const getAll = async () => {
  const users = await userRepository.findAll();
  return { users, aantal: users.length };
};

const getUser = async (id) => {
  const user = (await userRepository.findById(id))[0];

  if (!user) {
    throw ServiceError.notFound(`No user with id ${id} exists`, {
      id,
    });
  }

  return makeExposedUser(user);
};

const create = async ({
  voornaam,
  achternaam,
  telefoonnummer,
  email,
  geboortedatum,
  straat,
  huisnummer,
  postcode,
  plaats,
  land,
  password,
}) => {
  const passwordHash = await hashPassword(password);

  const users = (await getAll()).users;
  let maxId;
  if (users.length === 0) {
    maxId = 0;
  } else {
    maxId = Math.max(...users.map(({ id }) => id));
  }

  const nieuweUser = {
    id: maxId + 1,
    voornaam,
    achternaam,
    telefoonnummer,
    email,
    geboortedatum,
    straat,
    huisnummer,
    postcode,
    plaats,
    land,
    password_hash: passwordHash,
    roles: [Role.USER],
  };
  try {
    const uId = await userRepository.create(nieuweUser);
    const user = (await userRepository.findById(uId))[0];
    return await makeLoginData(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

const wijzig = async ({
  id,
  voornaam,
  achternaam,
  telefoonnummer,
  email,
  straat,
  huisnummer,
  postcode,
  plaats,
  land,
}) => {
  try {
    const uId = await userRepository.updateById({
      id,
      voornaam,
      achternaam,
      telefoonnummer,
      email,
      straat,
      huisnummer,
      postcode,
      plaats,
      land,
    });
    return await getUser(uId);
  } catch (error) {
    throw handleDBError(error);
  }
};

const verwijder = async (id) => {
  await getUser(id);

  try {
    await userRepository.deleteById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// 👇 8
const makeExposedUser = ({
  id,
  voornaam,
  achternaam,
  telefoonnummer,
  email,
  geboortedatum,
  straat,
  huisnummer,
  postcode,
  plaats,
  land,
  roles,
}) => ({
  id,
  voornaam,
  achternaam,
  telefoonnummer,
  email,
  geboortedatum,
  straat,
  huisnummer,
  postcode,
  plaats,
  land,
  roles,
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token,
  };
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given email and password do not match'
    );
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given email and password do not match'
    );
  }

  return await makeLoginData(user);
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);
  try {
    const { roles, userId } = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    getLogger().error(error.message, { error });
    throw new Error(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application'
    );
  }
};

module.exports = {
  getAll,
  getUser,
  create,
  wijzig,
  verwijder,
  login,
  checkAndParseSession,
  checkRole,
};
