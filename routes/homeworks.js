var express = require('express');
var router = express.Router();
const homeworkData = require('../models/homeworks_models');
const UserAuthorization = require('../xauth');
const xres = require('../xresponse');

router.get('/getAll', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			homeworkData.getAll(AuthTokenStatus.token, function(err, assignmentlist) {
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					xres.success(res, assignmentlist, AuthTokenStatus.refreshToken);
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
			homeworkData.deleteID(req.body.homeworkID, AuthTokenStatus.userID, function(err, dbResult_rem) {
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					homeworkData.getAll(AuthTokenStatus.token, function(err, assignmentlist) {
						if (err) 
						{
							console.debug(err);
							xres.error(res, "internal_database");
						} 
						else 
						{
							xres.success(res, assignmentlist, AuthTokenStatus.refreshToken);
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

router.post('/addNew', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			homeworkData.addNew(req.body.subjectID, AuthTokenStatus.userID, req.body.homeworkName, req.body.homeworkDate, function(err, dbResult_new) {
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					homeworkData.getAll(AuthTokenStatus.token, function(err, assignmentlist) {
						if (err) 
						{
							console.debug(err);
							xres.error(res, "internal_database");
						} 
						else 
						{
							xres.success(res, assignmentlist, AuthTokenStatus.refreshToken);
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