const mysql = require('mysql');
const pool = require('../../config/database');

module.exports = (() => {
    return {
        connection () {
            return mysql.createConnection(pool);
        }
    }
})();
