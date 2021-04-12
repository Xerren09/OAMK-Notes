var express = require('express');
var router = express.Router();
const usersData = require('../models/users_models');
const UserAuthorization = require('../auth');

router.post('/register', function(req, res) {
	usersData.getByEmail(req.body.userEmail, function(err, dbResult) {
		if (err) 
		{
			res.json(err);
		} 
		else 
		{
			if (dbResult.length == 0)
			{
				var authReg = UserAuthorization.Create(req.body.userPassword);
				usersData.registerNewUser(req.body, authReg, function(err, dbResult) {
					if (err) 
					{
						console.debug(err);
					} 
					else 
					{
						//User successfully registered
						var serverresponse = {
							valid: true,
							authToken: authReg.token
						};
						res.json(serverresponse);
					}
				});
			}
			else
			{
				//username is already taken
				var serverresponse = {
					valid: false,
				};
				res.json(serverresponse);
			}
		}
	});
});

router.post('/login', function(req, res) {
	usersData.getByEmail(req.body.userEmail, function(err, dbResult) {
		if (err) 
		{
			res.json(err);
		} 
		else 
		{
			if (dbResult.length != 0)
			{
				UserAuthorization.Verify(req.body.userPassword, req.body.userEmail, dbResult, function (token="0000") {
					if (token != "0000")
					{
						var serverresponse = {
							authSuccess: true,
							authToken: token
						};
					}
					else
					{
						var serverresponse = {
							authSuccess: false,
						};
					}
					res.json(serverresponse);
				});
			}
			else
			{
				var serverresponse = {
					authSuccess: false,
				};
				res.json(serverresponse);
			}
		}
	});
});

router.get('/refreshToken', function(req, res) {
	UserAuthorization.RefreshToken(req.headers.authtoken, function (result) {
		if (result.isvalid == true)
		{
			let serverresponse = {
				authAlive: false,
				authToken: result.token
			};
			res.json(serverresponse);
		}
		else
		{
			let serverresponse = {
				authAlive: false,
			};
			res.json(serverresponse);
		}	
	});
});

router.get('/getUserInfo', function(req, res) {
	UserAuthorization.VerifyToken(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			usersData.getByToken(req.headers.authtoken, function(err, dbResult) {
				if (err) 
				{
					res.json(err);
				} 
				else 
				{
					var serverresponse = {
						valid: true,
						userName: dbResult[0].userName,
						userEmail: dbResult[0].userEmail,
						userGroup: dbResult[0].userGroup
					};
					res.json(serverresponse);
				}
			});
		}
		else
		{
			res.json(AuthTokenStatus);
		}
	});
});

module.exports = router;