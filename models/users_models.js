const db = require('../database');

const authTokenLifeTime = 21600000;

const userQuery = {
	getByEmail: function(email, callback) {
		return db.query('SELECT * FROM users WHERE userEmail=?;', [email], callback);
	},
	
	registerNewUser: function(data, auth, callback) {
		return db.query('insert into users (userName, userEmail, userPassword, userGroup, authst, authTokenDate, authToken) values(?,?,?,?,?,?,?)', [data.userName, data.userEmail, auth.pass, data.userGroup, auth.salt, auth.tokenDate, auth.token], callback);;
	},
	
	addToken: function(token, email, callback) {
		var tokendate = (Date.now() + authTokenLifeTime);
		return db.query('update users set authToken=?, authTokenDate=? where userEmail=?', [token, tokendate, email], callback);
	},

	getByToken: function(token, callback) {
		return db.query('SELECT * FROM users WHERE authToken=?', [token], callback);
	},

	checkTokenDate: function(token, callback) {
		return db.query('SELECT * FROM users WHERE authToken=?', [token], callback);
	},

	refreshToken: function(token, tokenOld, callback) {
		var tokendate = (Date.now() + authTokenLifeTime);
		return db.query('update users set authToken=?, authTokenDate=? where authToken=?', [token, tokendate, tokenOld], callback);
	},
};
module.exports = userQuery;