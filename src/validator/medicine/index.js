const InvariantError = require('../../exceptions/InvariantError');
const { HistoryMedicinePayload } = require('./models');

const MedicineValidator = {
  validateHistoryMedicine: (payload) => {
    const validationResult = HistoryMedicinePayload.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = MedicineValidator;
