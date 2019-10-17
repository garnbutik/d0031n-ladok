const mysql = require("mysql");
const config = require("./config");

let connection = mysql.createConnection(config);

connection.connect(function(err) {
    if (err) {
        throw err;
    } else {
        console.log("Connected to database!");
    }
});

module.exports = connection;