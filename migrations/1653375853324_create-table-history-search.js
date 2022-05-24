exports.up = (pgm) => {
  pgm.createTable('history', {
    user_id: {
      type: 'TEXT',
      notNull: true,
    },
    medicine_id: {
      type: 'TEXT',
      notNull: true,
    },
    search_on: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint(
    'history',
    'fk_history.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'history',
    'fk_history.medicine_id_medicines.id',
    'FOREIGN KEY(medicine_id) REFERENCES medicines(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('history', 'fk_history.medicine_id_medicines.id');
  pgm.dropConstraint('history', 'fk_history.user_id_users.id');
  pgm.dropTable('history');
};
