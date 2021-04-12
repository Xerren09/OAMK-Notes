const db = require('../database');
const authTokenLifeTime = 21600000;
const tokenQuery = {
    checkTokenDate: function(token, callback) {
        return db.query('SELECT * FROM users WHERE authToken=?', [token], callback);
    },
    refreshToken: function(token, tokenOld, callback) {
        var tokendate = (Date.now() + authTokenLifeTime);
        return db.query('update users set authToken=?, authTokenDate=? where authToken=?', [token, tokendate, tokenOld], callback);
    },
    addToken: function(token, email, callback) {
        var tokendate = (Date.now() + authTokenLifeTime);
        return db.query('update users set authToken=?, authTokenDate=? where userEmail=?', [token, tokendate, email], callback);
    }
};
module.exports = tokenQuery;