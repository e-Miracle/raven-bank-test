/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('account_details', tbl => {
        tbl.bigIncrements();
        tbl.integer('user_id').notNullable()
        tbl.text("account_number", 128).notNullable();
        tbl.text("account_name", 128).notNullable();
        tbl.text("bank", 128).notNullable();
        tbl.text("balance", 128).notNullable().defaultTo(0);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
