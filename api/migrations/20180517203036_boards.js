exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('boards', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().references('users.id');
            table.json('structure');
            table.boolean('deleted').defaultTo(false);
            table.timestamps(true, true)
        }),
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('boards'),
    ]);
};

