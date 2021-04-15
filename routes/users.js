var express = require('express');
var router = express.Router();
const usersData = require('../models/users_models');
const UserAuthorization = require('../auth');

router.post('/register', function(req, res) {
	usersData.getByEmail(req.body.userEmail, function(err, dbResult) {
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
			if (dbResult.length == 0)
			{
				var authReg = UserAuthorization.Create(req.body.userPassword);
				usersData.registerNewUser(req.body, authReg, function(err, dbResult) {
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
						//User successfully registered
						let serverresponse = {
							status : "success",
							data : {
								token : authReg.token
							},
						};
						res.json(serverresponse);
					}
				});
			}
			else
			{
				//username is already taken
				let serverresponse = {
					status : "fail",
					data : {
						type : "credentials_exist" 
					},
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
			if (dbResult.length != 0)
			{
				UserAuthorization.Verify(req.body.userPassword, req.body.userEmail, dbResult, function (token="0000") {
					if (token != "0000")
					{
						let serverresponse = {
							status : "sucess",
							data : {
								token : token
							},
						};
						res.json(serverresponse);
					}
					else
					{
						let serverresponse = {
							status : "fail",
							data : {
								type : "credentials_unknown"
							},
						};
						res.json(serverresponse);
					}
				});
			}
			else
			{
				let serverresponse = {
					status : "fail",
					data : {
						type : "credentials_unknown" 
					},
				};
				res.json(serverresponse);
			}
		}
	});
});

router.get('/refreshToken-jiwoonisbigpog', function(req, res) {
	let serverresponse = "https://cdn.discordapp.com/attachments/703630208607191161/819778506866688000/Screenshot-2021-03-05-at-11.png"
	res.json(serverresponse);
	/*UserAuthorization.RefreshToken(req.headers.authtoken, function (result) {
		if (result.isvalid == true)
		{
			let serverresponse = {
				status : "success",
				data : {
					token : result.token 
				},
			};
			res.json(serverresponse);
		}
		else
		{
			let serverresponse = {
				status : "fail",
				data : {
					type : "credentials_unknown"
				},
			};
			res.json(serverresponse);
		}	
	});*/
});

router.get('/getUserInfo', function(req, res) {
	UserAuthorization.VerifyToken(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			usersData.getByToken(AuthTokenStatus.token, function(err, dbResult) {
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
							userName : dbResult[0].userName ,
							userEmail: dbResult[0].userEmail,
							userGroup: dbResult[0].userGroup,
							userPassword: "************",
							userID: dbResult[0].userID
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
					type : "credentials_unknown" 
				},
			};
			res.json(serverresponse);
		}
	});
});

module.exports = router;
