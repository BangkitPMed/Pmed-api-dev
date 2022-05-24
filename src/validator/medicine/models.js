const Joi = require('joi');

const HistoryMedicinePayload = Joi.object({
  medicineId: Joi.string().required(),
});

module.exports = {
  HistoryMedicinePayload,
};
