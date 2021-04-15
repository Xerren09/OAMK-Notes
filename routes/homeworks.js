var express = require('express');
var router = express.Router();
const homeworkData = require('../models/homeworks_models');
const UserAuthorization = require('../auth');

router.get('/getAll', function(req, res) {
	UserAuthorization.VerifyToken(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			homeworkData.getAll(AuthTokenStatus.token, function(err, dbResult) {
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

router.post('/remove', function(req, res) {
	UserAuthorization.VerifyToken(req.headers.authtoken, function (AuthTokenStatus) {
		if (AuthTokenStatus.isValid == true)
		{
			homeworkData.deleteID(req.body.homeworkid, AuthTokenStatus.userid, function(err, dbResult_rem) {
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
					homeworkData.getAll(AuthTokenStatus.token, function(err, dbResult) {
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
			homeworkData.addNew(req.body, function(err, dbResult_new) {
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
					homeworkData.getAll(AuthTokenStatus.token, function(err, dbResult) {
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