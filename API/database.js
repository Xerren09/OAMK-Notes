const mysql = require('mysql');
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  //host: '',
  //user: 'admin'
  //password: ''
  database: 'mydb'
});
module.exports = connection;