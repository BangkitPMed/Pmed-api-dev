const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

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

  async postReminder(data) {
    const {
      userId, medicineId, startAt, endAt,
    } = data;
    const id = `reminder-${nanoid(10)}`;

    const query = {
      text: 'INSERT INTO reminder VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [id, userId, medicineId, startAt, endAt],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('failed add reminder');
    }

    return result.rows[0];
  }

  async postReminderTime(reminderId, userId, data) {
    data.forEach(async (e) => {
      const query = {
        text: 'INSERT INTO reminder_time VALUES ($1, $2, $3)',
        values: [reminderId, userId, e.time],
      };

      await this._pool.query(query);
    });
  }

  async getAllReminder(userId) {
    const query = {
      text: `SELECT r.id, r.start_at, r.end_at, m.name FROM reminder r
      JOIN medicines m ON r.medicine_id = m.id
      WHERE r.user_id = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getAllReminderTime(userId) {
    const query = {
      text: 'SELECT reminder_id, time FROM reminder_time WHERE user_id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = MedicineControllers;
