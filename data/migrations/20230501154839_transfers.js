/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transfers', tbl => {
        tbl.bigIncrements();
        tbl.bigInteger('user_id').notNullable();
        tbl.text("reference", 128).notNullable();
        tbl.text("amount", 128).notNullable();
        tbl.text("bank_code", 128).notNullable();
        tbl.text("bank_name", 128).notNullable();
        tbl.text("account_number", 128).notNullable();
        tbl.text("account_name", 128).notNullable();
        tbl.text("narration", 128).notNullable();
        tbl.text("currency", 128).notNullable();
        tbl.tinyint('status').defaultTo(0)
        tbl.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
