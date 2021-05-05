const db = require('../database');

const notesQuery = {
	getAll: function(token, callback) {
		return db.query('SELECT subjects.subjectName, subjects.studyPeriod, subjects.studyYear, notes.noteName, notes.noteDate, notes.noteImportance, notes.noteText FROM subjects, users, notes WHERE users.authToken=? AND users.userID=subjects.userID AND users.userID=notes.userID AND subjects.subjectID=notes.subjectID;', [token], callback);
	},
	getTilesData: function(token, callback) {
		return db.query('SELECT subjects.subjectID, notes.noteID, notes.noteName, notes.noteDate, notes.noteImportance, LEFT(notes.noteText , 29) AS noteDescription FROM subjects, users, notes WHERE users.authToken=? AND users.userID=subjects.userID AND users.userID=notes.userID AND subjects.subjectID=notes.subjectID;', [token], callback);
	},
	getBasicUserInfo: function(token, callback) {
		return db.query('SELECT users.userName, users.userGroup FROM users WHERE authToken=?', [token], callback);
	},
	getAllSubjects: function(token, callback) {
		return db.query('SELECT subjects.subjectID, subjects.studyYear, subjects.studyPeriod, subjects.subjectName FROM subjects, users WHERE users.userID=subjects.userID AND users.authToken=? ORDER BY subjects.studyYear ASC, subjects.studyPeriod ASC', [token], callback);
	},
	getNoteByID: function(userID, noteID, callback) {
		return db.query('SELECT subjects.subjectID, subjects.subjectName, notes.noteID, notes.noteName, notes.noteDate, notes.noteImportance, notes.noteText FROM users, notes, subjects WHERE notes.noteID=? AND notes.subjectID=subjects.subjectID AND notes.userID=?;', [noteID, userID], callback);
	},
	addNewNote: function(subjectID, userID, noteName, noteDate, noteImportance, noteText, callback) {
		return db.query('INSERT INTO notes(subjectID, userID, noteName, noteDate, noteImportance, noteText) values(?, ?, ?, ?, ?, ?)', [subjectID, userID, noteName, noteDate, noteImportance, noteText], callback);
	}, 
	deleteID: function(remid, userid, callback){
		return db.query('DELETE FROM notes WHERE notes.noteID=? AND notes.userID=?', [remid, userid], callback);
	},
	updateNote: function(userid, noteid, notetext, callback){
		return db.query('UPDATE notes SET notes.noteText=? WHERE notes.noteID=? AND notes.userID?', [notetext, noteid, userid], callback);
	}
};
module.exports = notesQuery;