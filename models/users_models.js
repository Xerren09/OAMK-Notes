const db = require('../database');

const authTokenLifeTime = 21600000;

const userQuery = {
	getByEmail: function(email, callback) {
		return db.query('SELECT * FROM users WHERE userEmail=?', [email], callback);
	},
	
	registerAdditionalUserInfo: function(data, token, callback) {
		return db.query('UPDATE users SET userName=?, userGroup=? WHERE authToken=?', [data.userName, data.userGroup, token], callback);;
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

	connectioncheck: function(callback) {
		return db.query('SELECT * FROM users WHERE userID=1', callback);
	},

	updateGroup: function(userGroup, userID, callback) {
		return db.query('UPDATE users SET users.userGroup=? WHERE users.userID=?', [userGroup, userID], callback);
	},
	//;
};
module.exports = userQuery;