const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class MedicineControllers {
  constructor() {
    this._pool = new Pool();
  }

  async getMedicines(q) {
    const query = {
      text: 'SELECT id, name FROM medicines ORDER BY name',
    };

    const result = await this._pool.query(query);
    if (q) {
      return result.rows.filter((data) => {
        const loweredCaseaMedicinename = (data.name || '-').toLowerCase();
        const jammedMedicineName = loweredCaseaMedicinename.replace(/\s/g, '');

        const loweredCaseQuery = q.toLowerCase();
        const jammedQuery = loweredCaseQuery.replace(/\s/g, '');

        return jammedMedicineName.indexOf(jammedQuery) !== -1;
      });
    }

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

  async verifyMedicineId(id) {
    const query = {
      text: 'SELECT id FROM medicines WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('obat tidak ditemukan');
    }
  }

  async postHistorySearch(userId, medicineId) {
    const query = {
      text: 'INSERT INTO history VALUES ($1, $2)',
      values: [userId, medicineId],
    };

    await this._pool.query(query);
  }

  async getHistoryMedicine(userId) {
    const query = {
      text: `SELECT h.medicine_id, m.name, h.search_on FROM history h
      JOIN medicines m ON h.medicine_id = m.id
      WHERE h.user_id = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = MedicineControllers;
