class MedicineHandler {
  constructor(controllers, validator) {
    this._controllers = controllers;
    this._validator = validator;

    this.getAllMedicine = this.getAllMedicine.bind(this);
    this.getMedicineById = this.getMedicineById.bind(this);
    this.postReminderMedicineHandler = this.postReminderMedicineHandler.bind(this);
    this.getAllReminderByUserId = this.getAllReminderByUserId.bind(this);
  }

  async getAllMedicine(request) {
    const medicines = await this._controllers.getMedicines(request.query.q);

    return {
      status: 'success',
      data: {
        medicines,
      },
    };
  }

  async getMedicineById(request) {
    const { id } = request.params;
    const medicine = await this._controllers.getMedicineById(id);

    return {
      status: 'success',
      data: {
        medicine,
      },
    };
  }

  async postReminderMedicineHandler(request) {
    this._validator.validateReminder(request.payload);
    await this._controllers.verifyMedicineId(request.params.medicineId);

    const { startAt, endAt, reminderTime } = request.payload;
    const { medicineId } = request.params;
    const { id } = request.auth.credentials;

    const payload = {
      userId: id, medicineId, startAt, endAt,
    };
    const { id: reminderId } = await this._controllers.postReminder(payload);

    await this._controllers.postReminderTime(reminderId, id, reminderTime);

    return {
      status: 'success',
      message: 'successfuly added reminder',
    };
  }

  async getAllReminderByUserId(request) {
    const { id } = request.auth.credentials;

    const getReminder = await this._controllers.getAllReminder(id);
    const getReminderTime = await this._controllers.getAllReminderTime(id);
    const reminder = getReminder.map((data) => {
      const reminderTime = getReminderTime.filter((time) => time.reminder_id === data.id)
        .map((d) => ({
          time: d.time,
        }));

      return ({
        id: data.id,
        name: data.name,
        startAt: data.start_at,
        endAt: data.end_at,
        reminderTime,
      });
    });

    return {
      status: 'sucees',
      data: {
        reminder,
      },
    };
  }
}

module.exports = MedicineHandler;
