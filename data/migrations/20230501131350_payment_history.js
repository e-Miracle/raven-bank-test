/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('payment_history', tbl => {
        tbl.bigIncrements();
        tbl.bigInteger('user_id').notNullable();
        tbl.text("reference", 128).notNullable();
        tbl.text("type", 128).notNullable();
        tbl.tinyint('status').defaultTo(0)
        tbl.text("payload", 225).nullable();
        tbl.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("payment_history");
};
