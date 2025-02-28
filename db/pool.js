const { Pool } = require("pg");

const { HOST,
    USER,
    DATABASE,
    PASSWORD,
    // DBPORT
     } = process.env;

module.exports = new Pool ({
    host: HOST,
    user: USER,
    database: DATABASE,
    password: PASSWORD,
    // port: DBPORT

});

