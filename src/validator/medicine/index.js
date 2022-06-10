const InvariantError = require('../../exceptions/InvariantError');
const { HistoryMedicinePayload, ReminderPayload } = require('./models');

const MedicineValidator = {
  validateHistoryMedicine: (payload) => {
    const validationResult = HistoryMedicinePayload.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateReminder: (payload) => {
    const validationResult = ReminderPayload.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = MedicineValidator;
