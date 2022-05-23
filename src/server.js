require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// user
const users = require('./api/users');
const UserControllers = require('./controllers/postgres/UserControllers');
const UserValidator = require('./validator/users');

// Authentication
const authentication = require('./api/authentication');
const AuthenticationControllers = require('./controllers/postgres/AuthenticationControllers');
const AuthenticationValidator = require('./validator/authentication');
const MailSender = require('./controllers/nodemailer/MailSender');
const TokenManager = require('./tokenize/TokenManager');

// Medicine
const medicines = require('./api/medicines');
const MedicineControllers = require('./controllers/postgres/MedicineControllers');

// exception
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const userControllers = new UserControllers();
  const mailSender = new MailSender();
  const authenticationControllers = new AuthenticationControllers();
  const medicineControllers = new MedicineControllers();

  const server = Hapi.server({
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register external plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // jwt proctected routes
  server.auth.strategy('pmed_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username,
        email: artifacts.decoded.payload.email,
      },
    }),
  });

  // register plugin
  await server.register([
    {
      plugin: users,
      options: {
        controllers: userControllers,
        validator: UserValidator,
      },
    },
    {
      plugin: authentication,
      options: {
        controllers: authenticationControllers,
        validator: AuthenticationValidator,
        mailSender,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: medicines,
      options: {
        controllers: medicineControllers,
      },
    },
  ]);

  // handling client error and server error
  await server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const ClientErrorResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      ClientErrorResponse.code(response.statusCode);
      return ClientErrorResponse;
    }

    const serverError = h.response({
      status: 'error',
      statusCode: 500,
      message: 'Server Error',
    });
    serverError.code(500);
    return response.continue || response;
  });

  await server.start();
  console.log(`server running on ${server.info.uri}`);
};

init();
