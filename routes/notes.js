var express = require('express');
var router = express.Router();
const notesData = require('../models/notes_models');
const UserAuthorization = require('../auth');

router.get('/getAll', function(req, res) {
	notesData.getAll(req.headers.authtoken, function(err, dbResult) {
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