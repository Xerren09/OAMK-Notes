var express = require('express');
var router = express.Router();
const notesData = require('../models/notes_models');
const UserAuthorization = require('../auth');


router.get('/frontPage', function(req, res) {
	UserAuthorization.VerifyToken(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			notesData.getBasicUserInfo(AuthTokenStatus.token, function (err, dbResult_ui) {
				if (err)
				{
					console.debug(err);
					let serverresponse = {
						status : "error",
						data : {
							type : "internal_database" 
						},
					};
					res.json(serverresponse);
				}
				else
				{
					notesData.getTilesData(AuthTokenStatus.token, function(err, dbResult_note) {
						if (err)
						{
							console.debug(err);
							let serverresponse = {
								status : "error",
								data : {
									type : "internal_database" 
								},
							};
							res.json(serverresponse);
						}
						else
						{
							notesData.getAllSubjects(AuthTokenStatus.token, function (err, dbResult_sub) {
								if (err)
								{
									console.debug(err);
									let serverresponse = {
										status : "error",
										data : {
											type : "internal_database" 
										},
									};
									res.json(serverresponse);
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
									let serverresponse = {
										status : "success",
										data : {
											userinfo : dbResult_ui,
											sidebarcontent: subjectselectorcontent,
											frontpagecontent: dbResult_note 
										},
									};
									if (AuthTokenStatus.token != undefined && AuthTokenStatus.token != req.headers.authtoken)
									{
										serverresponse.data.authtoken = AuthTokenStatus.token;
									}
									res.json(serverresponse);
								}
							});
						}
					});
				}
			});
		}
		else
		{
			let serverresponse = {
				status : "fail",
				data : {
					type: "credentials_unknown"
				},
			};
			res.json(serverresponse);
		}
	});
});

router.post('/getNote', function(req, res) {
	UserAuthorization.VerifyToken(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			notesData.getNoteByID(AuthTokenStatus.token, function(err, dbResult){
				if (err) 
				{
					console.debug(err);
					let serverresponse = {
						status : "error",
						data : {
							type : "internal_database" 
						},
					};
					res.json(serverresponse);
				} 
				else 
				{
					let serverresponse = {
						status : "success",
						data : {dbResult},
					};
					if (AuthTokenStatus.token != undefined && AuthTokenStatus.token != req.headers.authtoken)
					{
						serverresponse.data.authtoken = AuthTokenStatus.token;
					}
					res.json(serverresponse);
				}
			});
		}
		else
		{
			let serverresponse = {
				status : "fail",
				data : {
					type: "credentials_unknown"
				},
			};
			res.json(serverresponse);
		}
	});
});

router.post('/addNew', function(req, res) {
	UserAuthorization.VerifyToken(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			notesData.addNewNote(req.body.subjectid, AuthTokenStatus.userid, req.body.notename, req.body.notedate, req.body.noteimportance, req.body.notetext, function(err, dbResult){
				if (err) 
				{
					console.debug(err);
					let serverresponse = {
						status : "error",
						data : {
							type : "internal_database" 
						},
					};
					res.json(serverresponse);
				} 
				else 
				{
					let serverresponse = {
						status : "success",
						data : {
							
						},
					};
					if (AuthTokenStatus.token != undefined && AuthTokenStatus.token != req.headers.authtoken)
					{
						serverresponse.data.authtoken = AuthTokenStatus.token;
					}
					res.json(serverresponse);
				}
			});
		}
		else
		{
			let serverresponse = {
				status : "fail",
				data : {
					type: "credentials_unknown"
				},
			};
			res.json(serverresponse);
		}
	});
});

router.post('/remove', function(req, res) {
	UserAuthorization.VerifyToken(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			notesData.deleteID(req.body.noteid, AuthTokenStatus.userid, function(err, dbResult_rem) {
				if (err) 
				{
					console.debug(err);
					let serverresponse = {
						status : "error",
						data : {
							type : "internal_database" 
						},
					};
					res.json(serverresponse);
				} 
				else 
				{
					notesData.getTilesData(AuthTokenStatus.token, function(err, dbResult_note) {
						if (err) 
						{
							console.debug(err);
							let serverresponse = {
								status : "error",
								data : {
									type : "internal_database" 
								},
							};
							res.json(serverresponse);
						} 
						else 
						{
							let serverresponse = {
								status : "success",
								data : {dbResult_note},
							};
							if (AuthTokenStatus.token != undefined && AuthTokenStatus.token != req.headers.authtoken)
							{
								serverresponse.data.authtoken = AuthTokenStatus.token;
							}
							res.json(serverresponse);
						}
					});
				}
			});
		}
		else
		{
			let serverresponse = {
				status : "fail",
				data : {
					type: "credentials_unknown"
				},
			};
			res.json(serverresponse);
		}
	});
});

module.exports = router;