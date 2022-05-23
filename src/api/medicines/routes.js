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
];

module.exports = routes;
