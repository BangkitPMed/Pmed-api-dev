const MedicineHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'medicine',
  version: '1.0.0',
  register: async (server, { controllers }) => {
    const medicineHanler = new MedicineHandler(controllers);
    server.route(routes(medicineHanler));
  },
};
