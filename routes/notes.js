var express = require('express');
var router = express.Router();
const notesData = require('../models/notes_models');
const UserAuthorization = require('../xauth');
const xres = require('../xresponse');


router.get('/frontPage', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			notesData.getBasicUserInfo(AuthTokenStatus.token, function (err, userinfo) {
				if (err)
				{
					console.debug(err);
					xres.error(res, "internal_database");
				}
				else
				{
					notesData.getTilesData(AuthTokenStatus.token, function(err, frontpagecontent) {
						if (err)
						{
							console.debug(err);
							xres.error(res, "internal_database");
						}
						else
						{
							notesData.getAllSubjects(AuthTokenStatus.token, function (err, dbResult_sub) {
								if (err)
								{
									console.debug(err);
									xres.error(res, "internal_database");
								}
								else
								{
									let subjectselectorcontent = {};
									for (let i = 0; i < dbResult_sub.length; i++)
									{
										let year = dbResult_sub[i].studyYear;
										let period = dbResult_sub[i].studyPeriod;
										if (subjectselectorcontent[year] == undefined)
										{
											subjectselectorcontent[year] = {};
										}
										if (subjectselectorcontent[year][period] == undefined)
										{
											subjectselectorcontent[year][period] = [];
										}
										subjectselectorcontent[year][period].push({subjectID: dbResult_sub[i].subjectID, subjectName: dbResult_sub[i].subjectName});
									}
									xres.success(res, {userinfo, subjectselectorcontent, frontpagecontent}, AuthTokenStatus.refreshToken);
								}
							});
						}
					});
				}
			});
		}
		else
		{
			xres.fail(res, "credentials_unknown");
		}
	});
});

router.post('/getNote', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			notesData.getNoteByID(req.body.noteID, function(err, noteData){
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					xres.success(res, noteData, AuthTokenStatus.refreshToken);
				}
			});
		}
		else
		{
			xres.fail(res, "credentials_unknown");
		}
	});
});

router.post('/addNew', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			notesData.addNewNote(req.body.subjectID, AuthTokenStatus.userID, req.body.noteName, req.body.noteDate, req.body.noteImportance, req.body.noteText, function(err, dbResult){
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					xres.success(res, null, AuthTokenStatus.refreshToken);
				}
			});
		}
		else
		{
			xres.fail(res, "credentials_unknown");
		}
	});
});

router.post('/updateNote', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			notesData.updateNote(req.body.noteID, req.body.noteText, function(err, dbResult){
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					xres.success(res, null, AuthTokenStatus.refreshToken);
				}
			});
		}
		else
		{
			xres.fail(res, "credentials_unknown");
		}
	});
});

router.post('/remove', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			notesData.deleteID(req.body.noteID, AuthTokenStatus.userID, function(err, dbResult_rem) {
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					notesData.getTilesData(AuthTokenStatus.token, function(err, frontpagecontent) {
						if (err) 
						{
							console.debug(err);
							xres.error(res, "internal_database");
						} 
						else 
						{
							xres.success(res, {frontpagecontent}, AuthTokenStatus.refreshToken);
						}
					});
				}
			});
		}
		else
		{
			xres.fail(res, "credentials_unknown");
		}
	});
});

module.exports = router;