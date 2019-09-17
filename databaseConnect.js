//npm install mysql
//npm install mysqljs/mysql

var mysql = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'su218',
    password: 'su218',
    database: 'fintech'
});

connection.connect();

connection.query('SELECT * FROM user', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

connection.end();
