const db = require('../database');

const subjectQuery = {
	getAll: function(token, callback) {
		return db.query('SELECT subjects.subjectID, subjects.studyYear, subjects.studyPeriod, subjects.subjectName FROM subjects, users WHERE users.userID=subjects.userID AND users.authToken=? ORDER BY subjects.studyYear ASC, subjects.studyPeriod ASC', [token], callback);
	},
	addNew: function(user, name, period, year, callback) {
		return db.query('insert into subjects(userID, subjectName, studyPeriod, studyYear) values(?, ?, ?, ?);', [user, name, period, year], callback);
	}, 
	deleteID: function(remid, userid, callback) {
		return db.query('DELETE FROM subjects WHERE subjects.subjectID=? AND subjects.userID=?', [remid, userid], callback);
	}
};
module.exports = subjectQuery;