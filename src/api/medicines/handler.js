class MedicineHandler {
  constructor(controllers, validator) {
    this._controllers = controllers;
    this._validator = validator;

    this.getAllMedicine = this.getAllMedicine.bind(this);
    this.getMedicineById = this.getMedicineById.bind(this);
    this.postHistoryMedicine = this.postHistoryMedicine.bind(this);
    this.getHistoryMedicine = this.getHistoryMedicine.bind(this);
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

  async postHistoryMedicine(request) {
    this._validator.validateHistoryMedicine(request.payload);

    const { medicineId } = request.payload;
    const { id } = request.auth.credentials;

    await this._controllers.verifyMedicineId(medicineId);
    await this._controllers.postHistorySearch(id, medicineId);

    return {
      status: 'success',
      message: 'successfully add history search',
    };
  }

  async getHistoryMedicine(request) {
    const { id } = request.auth.credentials;

    const history = await this._controllers.getHistoryMedicine(id);

    return {
      status: 'success',
      data: {
        history,
      },
    };
  }
}

module.exports = MedicineHandler;
