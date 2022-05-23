const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class MedicineControllers {
  constructor() {
    this._pool = new Pool();
  }

  async getMedicines() {
    const query = {
      text: 'SELECT id, name FROM medicines ORDER BY name',
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getMedicineById(id) {
    const query = {
      text: 'SELECT * FROM medicines WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('medicine not found');
    }
    const data = {
      id: result.rows[0].id,
      nama: result.rows[0].name,
      pengunaan: result.rows[0].descripsion,
      cara_kerja: result.rows[0].how_medicine_works,
      efek_samping: result.rows[0].side_effect,
      pemakaian_obat: result.rows[0].medicine_usage,
      dosis: result.rows[0].dose,
      interaksi: result.rows[0].interaction,
    };
    return data;
  }
}

module.exports = MedicineControllers;
