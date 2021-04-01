var express = require('express');
var router = express.Router();
const homeworkData = require('../models/homeworks_models');

router.get('/getAll', function(req, res) {
	homeworkData.getAll(req.body.authToken, function(err, dbResult) {
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