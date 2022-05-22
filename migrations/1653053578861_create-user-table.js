exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    email: {
      type: 'TEXT',
      notNull: true,
      unique: true,
    },
    username: {
      type: 'TEXT',
      notNull: true,
      unique: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
    gender: {
      type: 'TEXT',
      notNull: true,
    },
    age: {
      type: 'INT',
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    is_email_verified: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
