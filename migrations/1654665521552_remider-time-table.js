exports.up = (pgm) => {
  pgm.createTable('reminder_time', {
    reminder_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'reminder(id)',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    time: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('reminder_time');
};
