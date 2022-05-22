const routes = (handler) => [
  {
    method: 'POST',
    path: '/register',
    handler: handler.registerUserHandler,
  },
  {
    method: 'GET',
    path: '/profile',
    handler: handler.getUserProfileHanlder,
    options: {
      auth: 'pmed_jwt',
    },
  },
];

module.exports = routes;
