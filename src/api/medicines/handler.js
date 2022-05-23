class MedicineHandler {
  constructor(controllers) {
    this._controllers = controllers;

    this.getAllMedicine = this.getAllMedicine.bind(this);
    this.getMedicineById = this.getMedicineById.bind(this);
  }

  async getAllMedicine() {
    const medicine = await this._controllers.getMedicines();

    return {
      status: 'success',
      data: {
        medicine,
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
}

module.exports = MedicineHandler;
