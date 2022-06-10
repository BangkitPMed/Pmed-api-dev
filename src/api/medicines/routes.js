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
    path: '/reminder/{medicineId}',
    handler: handler.postReminderMedicineHandler,
    options: {
      auth: 'pmed_jwt',
    },
  },
  {
    method: 'GET',
    path: '/reminder',
    handler: handler.getAllReminderByUserId,
    options: {
      auth: 'pmed_jwt',
    },
  },
];

module.exports = routes;
