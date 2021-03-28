const db = require('../database');

const homeworkQuery = {
	getAll: function(token, callback) {
		return db.query('SELECT subjects.subjectName, subjects.studyPeriod, subjects.studyYear, homeworks.homeworkName, homeworks.homeworkDate FROM subjects, users, homeworks WHERE users.authToken=? AND users.userID=subjects.userID AND users.userID=homeworks.userID AND subjects.subjectID=homeworks.subjectID;', [token], callback);
	}
};
module.exports = homeworkQuery;