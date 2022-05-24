const MedicineHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'medicine',
  version: '1.0.0',
  register: async (server, { controllers, validator }) => {
    const medicineHanler = new MedicineHandler(controllers, validator);
    server.route(routes(medicineHanler));
  },
};
