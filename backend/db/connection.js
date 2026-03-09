const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lpa_ecomm'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = connection;