exports.up = (pgm) => {
  pgm.createTable('medicines', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    descripsion: {
      type: 'TEXT',
    },
    how_medicine_works: {
      type: 'TEXT',
    },
    side_effect: {
      type: 'TEXT',
    },
    medicine_usage: {
      type: 'TEXT',
    },
    dose: {
      type: 'TEXT',
    },
    interaction: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('medicines');
};
