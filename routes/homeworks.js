var express = require('express');
var router = express.Router();
const homeworkData = require('../models/homeworks_models');
const UserAuthorization = require('../auth');

router.get('/getAll', function(req, res) {
	homeworkData.getAll(req.headers.authtoken, function(err, dbResult) {
		if (err) 
		{
			res.json(err);
		} 
		else 
		{
			res.json(dbResult);
		}
	});
});

module.exports = router;