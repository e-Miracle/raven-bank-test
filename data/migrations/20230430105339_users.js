/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.bigIncrements();
        tbl.text("email", 128).notNullable();
        tbl.text("password", 128).notNullable();
        tbl.text("first_name", 128).notNullable();
        tbl.text("last_name", 128).notNullable();
        tbl.text("phone", 128).notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
