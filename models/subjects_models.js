const db = require('../database');

const subjectQuery = {
	getAll: function(token, callback) {
		return db.query('SELECT subjects.subjectName, subjects.studyPeriod, subjects.studyYear FROM subjects, users WHERE users.authToken=? AND users.userID=subjects.userID', [token], callback);
	}
};
module.exports = subjectQuery;