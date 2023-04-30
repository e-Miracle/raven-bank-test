const knex = require("knex");
require('dotenv').config()

const knexFile = require("../knexfile");

const env = process.env.NODE_ENV || 'development';
const options = knexFile[env];

module.exports = knex(options);