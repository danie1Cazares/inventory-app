const { Pool } = require("pg");

const { HOST,
    USER,
    NAME,
    PASSWORD,
    // DBPORT
     } = process.env;

module.exports = new Pool ({
    host: HOST,
    user: USER,
    database: NAME,
    password: PASSWORD,
    ssl: true

    // port: DBPORT

});

