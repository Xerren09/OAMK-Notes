var express = require('express');
var router = express.Router();
const usersData = require('../models/users_models');

const authTokenLifeTime = 21600000;

const UserAuthorization = {
    authSaltLength: 32,
    createSecurePassword: function(password) {
        var crypto = require('crypto');
        var authPassword = password.toString().trim();
        var authSalt = crypto.randomBytes(UserAuthorization.authSaltLength).toString('hex');
        var authorizationToken_RAW = (authPassword + authSalt);
        var authorizationToken = crypto.createHash('sha256').update(authorizationToken_RAW).digest('hex');
        var authToken = crypto.randomBytes(64).toString('hex');
		return {
            salt: authSalt,
            pass: authorizationToken,
			token: authToken,
			tokenDate: (Date.now() + authTokenLifeTime)
        };
    },
    verifyUserAuthorization: function(password, userID, dbResult, res) {
        var crypto = require('crypto');
		var userAuthorizationToken_Stored = dbResult[0].userPassword;
		var userAuthorizationSalt_Stored = dbResult[0].authst;
		var userAuthorizationTokenPlain_Local = (password + userAuthorizationSalt_Stored);
		var userAuthorizationToken_Local = crypto.createHash('sha256').update(userAuthorizationTokenPlain_Local).digest('hex');
		if(userAuthorizationToken_Local == userAuthorizationToken_Stored)
		{
			//Tokens match: user provided the correct password
			var authToken = crypto.randomBytes(64).toString('hex');
			usersData.addToken(authToken, userID, function(err, dbResult) {
				if (err) 
				{
					//console.debug(err);
				} 
				else 
				{
					//AuthToken successfully saved
				}
			});
			var serverresponse = {
				authSuccess: true,
				authID: dbResult[0].userEmail,
				authToken: authToken
			};
			res.json(serverresponse);				
		}
		else
		{
			//Tokens do not match: user provided the incorrect password
			var serverresponse = {
				authSuccess: false,
			};
			res.json(serverresponse);
		}
    }
}

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
						var authReg = UserAuthorization.createSecurePassword(req.body.userPassword);
						usersData.registerNewUser(req.body, authReg, function(err, dbResult) {
							if (err) 
							{
								console.debug(err);
							} 
							else 
							{
								//User successfully registered
							}
						});
						//
						var serverresponse = {
							valid: true,
							//authID: dbResult[0].userEmail,
							authToken: authReg.token
						};
						res.json(serverresponse);
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
				UserAuthorization.verifyUserAuthorization(req.body.userPassword, req.body.userEmail, dbResult, res);
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

router.post('/refreshToken', function(req, res) {
	usersData.checkTokenDate(req.headers.authtoken, function(err, dbResult){
		if (err) 
		{
			res.json(err);
		} 
		else 
		{
			if (dbResult.length != 0)
			{
				if (Date.now() >= dbResult[0].authTokenDate)
				{
					var crypto = require('crypto');
					var authToken = crypto.randomBytes(64).toString('hex');
					usersData.refreshToken(authToken, dbResult[0].authToken, function(err, dbResult_refresh) {
						if (err) 
						{
							res.json(err);
						} 
					});
					var serverresponse = {
						authAlive: false,
						authToken: authToken
					};
					res.json(serverresponse);
				}
				else
				{
					var serverresponse = {
						authAlive: true
					};
					res.json(serverresponse);
				}
			}
			else
			{
				var serverresponse = {
					authAlive: false
				};
				res.json(serverresponse);
			}
		}
	});
});

router.get('/getUserInfo', function(req, res) {
	usersData.getByToken(req.headers.authtoken, function(err, dbResult) {
		if (err) 
		{
			res.json(err);
		} 
		else 
		{
			if (dbResult.length != 0)
			{
				var serverresponse = {
					valid: true,
					userName: dbResult[0].userName,
					userEmail: dbResult[0].userEmail,
					userGroup: dbResult[0].userGroup
				};
				res.json(serverresponse);
			}
			else
			{
				var serverresponse = {
					valid: false
				};
				res.json(serverresponse);
			}
		}
	});
});

module.exports = router;
