const db = require('../database');

const notesQuery = {
	getAll: function(token, callback) {
		return db.query('SELECT subjects.subjectName, subjects.studyPeriod, subjects.studyYear, notes.noteName, notes.noteDate, notes.noteImportance, notes.noteText FROM subjects, users, notes WHERE users.authToken=? AND users.userID=subjects.userID AND users.userID=notes.userID AND subjects.subjectID=notes.subjectID;', [token], callback);
	}
};
module.exports = notesQuery;