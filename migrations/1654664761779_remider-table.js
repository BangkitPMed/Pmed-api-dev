exports.up = (pgm) => {
  pgm.createTable('reminder', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    medicine_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'medicines(id)',
      onDelete: 'CASCADE',
    },
    start_at: {
      type: 'TEXT',
      notNull: true,
    },
    end_at: {
      type: 'TEXT',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('reminder');
};
