
exports.up = function(knex, Promise) {
  knex.schema.raw(`
  ALTER TABLE boards 
  ADD CONSTRAINT [Data record should be formatted as JSON]
  CHECK (ISJSON(data)=1)
  `)
};

exports.down = function(knex, Promise) {
    knex.schema.raw(`
    ALTER TABLE boards 
    DROP CONSTRAINT [Data record should be formatted as JSON]
    `)
};
