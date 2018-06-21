
exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('users', function (table) {
            table.increments('id').primary();
            table.string('email').unique().notNullable();
            table.string('hash').notNullable();
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.boolean('admin').defaultTo(false);
            table.timestamps(true, true)
        }),
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
    ]);
};
