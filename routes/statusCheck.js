var express = require('express');
var router = express.Router();
const usersData = require('../models/users_models');
const xres = require('../xresponse');

router.get('/status', function(req, res) {
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
module.exports = router;