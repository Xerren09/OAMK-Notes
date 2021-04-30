var express = require('express');
var router = express.Router();
const usersData = require('../models/users_models');
const UserAuthorization = require('../xauth');
const xres = require('../xresponse');

router.post('/register', function(req, res) {
	UserAuthorization.Register(req.body.userPassword, req.body.userEmail, function(regResult) {
		if(regResult == "internal_database")
		{
			xres.error(res, "internal_database");
		}
		else if (regResult.registrationValid == true)
		{
			usersData.registerAdditionalUserInfo(req.body, regResult.userToken, function(err, dbResult) {
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					xres.success(res, null, regResult.userToken);
				}
			});
		}
		else
		{
			xres.fail(res, "credentials_exist");
		}
	});
});

router.post('/login', function(req, res) {
	UserAuthorization.Login(req.body.userPassword, req.body.userEmail, function (token="0000") {
		if (token == "internal_database")
		{
			xres.error(res, "internal_database");
		}
		else if (token != "0000")
		{
			xres.success(res, null, token);
		}
		else
		{
			xres.fail(res, "credentials_unknown");
		}
	});
});

router.get('/apistatus', function(req, res) {
	usersData.connectioncheck(function(err, dbResult){
		if (err)
		{
			xres.success(res, {
				AppServiceStatus : "alive",
				DatabaseServiceStatus :  "down",
				Check: {encode: "base64", content1: "aHR0cHM6Ly90aW55dXJsLmNvbS9qaXdvb25pc2JpZ3BvZw=="}
			});
		}
		else
		{
			xres.success(res, {
				AppServiceStatus : "alive",
				DatabaseServiceStatus :  "alive",
				Check: {encode: "base64", content1: "aHR0cHM6Ly90aW55dXJsLmNvbS9qaXdvb25pc2JpZ3BvZw==",  content2: "https://tinyurl.com/jiwoonisbigpog"}
			});
		}
	});
});

router.get('/getUserInfo', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			usersData.getByToken(AuthTokenStatus.token, function(err, dbResult) {
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					xres.success(res, {
						userName : dbResult[0].userName ,
						userEmail: dbResult[0].userEmail,
						userGroup: dbResult[0].userGroup,
						userPassword: "************",
						userID: dbResult[0].userID
					}, AuthTokenStatus.refreshToken);
				}
			});
		}
		else
		{
			xres.fail(res, "credentials_unknown");
		}
	});
});

router.post('/updateGroupCode', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			usersData.updateGroup(req.body.userGroup, AuthTokenStatus.userid, function(err, dbResult) {
				if (err) 
				{
					console.debug(err);
					xres.error(res, "internal_database");
				} 
				else 
				{
					xres.success(res, {userGroup: req.body.usergroup}, AuthTokenStatus.refreshToken);
				}
			});
		}
		else
		{
			xres.fail(res, "credentials_unknown");
		}
	});
});

router.post('/updatePassword', function(req, res) {
	UserAuthorization.Verify(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			UserAuthorization.Update(req.body.userPassword, req.body.userEmail, function (updateResult) {
				if(updateResult == "internal_database")
				{
					xres.error(res, "internal_database");
				}
				else if (updateResult.updateValid == true)
				{
					xres.success(res, null, updateResult.userToken);
				}
				else
				{
					xres.fail(res, "credentials_unknown");
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