const mysql = require("mysql");
const config = require("./config");
const util = require("util");


let pool = mysql.createPool(config);

pool.getConnection(function(err, connection) {
    if (err) {
        throw err;
    } else {
        console.log("Connected to database!");
    }
    if (connection) {
        connection.release();
    }
});

pool.query = util.promisify(pool.query);


module.exports = pool;