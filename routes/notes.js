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
			notesData.getNoteByID(AuthTokenStatus.token, function(err, dbResult){
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					xres.success(res, dbResult, AuthTokenStatus.refreshToken);
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
			notesData.addNewNote(req.body.subjectid, AuthTokenStatus.userid, req.body.notename, req.body.notedate, req.body.noteimportance, req.body.notetext, function(err, dbResult){
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					xres.success(res, "no_content", AuthTokenStatus.refreshToken);
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
			notesData.deleteID(req.body.noteid, AuthTokenStatus.userid, function(err, dbResult_rem) {
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					notesData.getTilesData(AuthTokenStatus.token, function(err, dbResult_note) {
						if (err) 
						{
							console.debug(err);
							xres.error(res, "internal_database");
						} 
						else 
						{
							xres.success(res, dbResult_note, AuthTokenStatus.refreshToken);
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