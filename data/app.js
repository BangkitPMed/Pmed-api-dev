/* eslint-disable max-len */
require('dotenv').config();
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const data = require('./data');

const pool = new Pool();
let count = 0;
console.log(data.length);

data.forEach((val) => {
  if (val.dosis) {
    const id = `medicine-${nanoid(10)}`;
    const query = {
      text: 'INSERT INTO medicines VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [id, val.judul, val.pengunaan, val.cara_kerja, val.efek_samping, val.Pemakaian_obat, val.dosis, val.interaksi],
    };

    const res = pool.query(query);

    res.then(() => {
      count += 1;
    }).catch((err) => console.log(err));
  }
});

console.log(count);
