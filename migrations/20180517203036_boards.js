exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('boards', function (table) {
            table.increments('id').primary();
            table.json('tree');
        }),
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('boards'),
    ]);
};

