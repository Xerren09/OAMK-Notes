const mysql = require('mysql');
const fs = require('fs');
require('dotenv').config()
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER, 
	password: process.env.DB_PASS,
	database:"mydb",
	port:3306,
	ssl:{
		ca: fs.readFileSync("./certificate/DigiCertGlobalRootCA.crt.pem")
		}
});
module.exports = connection;