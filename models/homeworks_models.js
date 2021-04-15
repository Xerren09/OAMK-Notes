const db = require('../database');

const homeworkQuery = {
	getAll: function(token, callback) {
		return db.query('SELECT homeworks.homeworkID, subjects.subjectName, homeworks.homeworkName, homeworks.homeworkDate FROM subjects, users, homeworks WHERE users.authToken=? AND users.userID=subjects.userID AND users.userID=homeworks.userID AND subjects.subjectID=homeworks.subjectID ORDER BY homeworks.homeworkDate desc;', [token], callback);
	}, 
	deleteID: function(remid, userid, callback){
		return db.query('DELETE FROM homeworks WHERE homeworks.homeworkID=? AND homeworks.userID=?', [remid, userid], callback);
	},
	addNew: function(body, callback){
		return db.query('INSERT INTO homeworks(subjectID, userID, homeworkName, homeworkDate) values(?, ?, ?, ?);', [body.subjectid, body.userid, body.homeworkname, body.homeworkdate], callback);
	}
};
module.exports = homeworkQuery;