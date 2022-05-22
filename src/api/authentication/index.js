const AuthenticationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentication',
  version: '1.0.0',
  register: async (server, {
    controllers, validator, mailSender, tokenManager,
  }) => {
    const authenticationHandler = new AuthenticationHandler({
      controllers, validator, mailSender, tokenManager,
    });
    server.route(routes(authenticationHandler));
  },
};
