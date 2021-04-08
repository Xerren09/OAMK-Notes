const crypto = require('crypto');
const usersData = require('../models/users_models');
const Security = {
    authTokenLifeTime: 21600000,
    authSaltLength: 32,
    generateAuthToken: function (length) {
        var token = crypto.randomBytes(length).toString('hex');
        return token;
    },
    createSecurePassword: function(password) {
        var authPassword = password.toString().trim();
        var authSalt = crypto.randomBytes(UserAuthorization.authSaltLength).toString('hex');
        var authPassEnc_RAW = (authPassword + authSalt);
        var authPassEnc = crypto.createHash('sha256').update(authPassEnc_RAW).digest('hex');
        var authToken = crypto.randomBytes(64).toString('hex');
        return {
            salt: authSalt,
            pass: authPassEnc,
            token: authToken,
            tokenDate: (Date.now() + authTokenLifeTime)
        };
    },
    UserAuthorization: function(password, dbResult, res) {
        var userAuthorizationToken_Stored = dbResult[0].userPassword;
        var userAuthorizationSalt_Stored = dbResult[0].authst;
        var userAuthorizationTokenPlain_Local = (password + userAuthorizationSalt_Stored);
        var userAuthorizationToken_Local = crypto.createHash('sha256').update(userAuthorizationTokenPlain_Local).digest('hex');
        if(userAuthorizationToken_Local == userAuthorizationToken_Stored)
        {
            var authToken = crypto.randomBytes(64).toString('hex');
            // Save token here
            var serverresponse = {
                authSuccess: true,
                authToken: authToken
            };
            res.json(serverresponse);				
        }
        else
        {
            var serverresponse = {
                authSuccess: false,
            };
            res.json(serverresponse);
        }
    },
    CheckTokenValidity: function(token, res) {
        let checkToken = new Promise((resolve) => {
            usersData.checkTokenDate(token, function(err, dbResult){
                if (err) {res.json(err);}
                else if (dbResult.length != 0)
                {
                    if (Date.now() >= dbResult[0].authTokenDate)
                    {
                        resolve(false);
                    }
                    else
                    {
                        resolve(true);
                    }
                }
            });
        });
        checkToken.then((successMessage) => {
            //console.log("Yay! " + successMessage)
            if (successMessage == true) {return true;} else {return false;}
        });
    }
};
module.exports = Security;