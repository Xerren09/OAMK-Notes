var express = require('express');
var router = express.Router();
const subjectData = require('../models/subjects_models');
const UserAuthorization = require('../xauth');
const xres = require('../xresponse');

router.post('/addNew', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			subjectData.addNew(AuthTokenStatus.userID, req.body.subjectName, req.body.subjectPeriod, req.body.subjectYear, function(err, dbResult){
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					subjectData.getAll(AuthTokenStatus.token, function (err, dbResult_sub) {
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
							xres.success(res, subjectselectorcontent, AuthTokenStatus.refreshToken);
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

router.post('/remove', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			subjectData.deleteID(req.body.subjectID, AuthTokenStatus.userID, function(err, dbResult_rem) {
				if (err) 
				{
					console.debug(err);
					if (err.sqlState == 23000)
					{
						xres.fail(res, "key_inuse");
					}
					else
					{
						console.debug(err);
						xres.error(res, "internal_database");
					}
				} 
				else 
				{
					subjectData.getAll(AuthTokenStatus.token, function (err, dbResult_sub) {
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
							xres.success(res, subjectselectorcontent, AuthTokenStatus.refreshToken);
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