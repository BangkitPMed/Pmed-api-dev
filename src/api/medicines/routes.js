const routes = (handler) => [
  {
    method: 'GET',
    path: '/medicines',
    handler: handler.getAllMedicine,
  },
  {
    method: 'GET',
    path: '/medicines/{id}',
    handler: handler.getMedicineById,
  },
  {
    method: 'POST',
    path: '/history',
    handler: handler.postHistoryMedicine,
    options: {
      auth: 'pmed_jwt',
    },
  },
  {
    method: 'GET',
    path: '/history',
    handler: handler.getHistoryMedicine,
    options: {
      auth: 'pmed_jwt',
    },
  },
];

module.exports = routes;
