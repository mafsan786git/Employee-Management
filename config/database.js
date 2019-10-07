const mysql = require('mysql');

//database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12180058',
    database: 'authentication',
});

connection.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('database is connected');
    }
});
module.exports = connection;
