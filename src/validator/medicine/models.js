const Joi = require('joi');

const HistoryMedicinePayload = Joi.object({
  medicineId: Joi.string().required(),
});

const reminderTime = Joi.object({
  time: Joi.string(),
});

const ReminderPayload = Joi.object({
  startAt: Joi.string().required(),
  endAt: Joi.string().required(),
  reminderTime: Joi.array().items(reminderTime),
});

module.exports = {
  HistoryMedicinePayload,
  ReminderPayload,
};
