var express = require('express');
var router = express.Router();
const subjectData = require('../models/subjects_models');
const UserAuthorization = require('../auth');

router.post('/addNew', function(req, res) {
	UserAuthorization.VerifyToken(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			subjectData.addNew(AuthTokenStatus.userid, req.body.subjectname, req.body.subjectperiod, req.body.subjectyear, function(err, dbResult){
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
					subjectData.getAll(AuthTokenStatus.token, function (err, dbResult_sub) {
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
								data : {subjectselectorcontent},
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

router.post('/remove', function(req, res) {
	UserAuthorization.VerifyToken(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			subjectData.deleteID(req.body.subjectid, AuthTokenStatus.userid, function(err, dbResult_rem) {
				if (err) 
				{
					console.debug(err);
					if (err.sqlState == 23000)
					{
						let serverresponse = {
							status : "fail",
							data : {
								type : "key_inuse" 
							},
						};
						res.json(serverresponse);
					}
					else
					{
						let serverresponse = {
							status : "error",
							data : {
								type : "internal_database" 
							},
						};
						res.json(serverresponse);
					}
				} 
				else 
				{
					subjectData.getAll(AuthTokenStatus.token, function (err, dbResult_sub) {
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
								data : {subjectselectorcontent},
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