const crypto = require('crypto');
const tokenData = require('./models/tokenHandler_models');

const UserAuthorization = {
    authSaltLength: 32,
    authTokenLifeTime: 21600000,
    authTokenGracePeriod: 3600000,
    Create: function(password) {
        var authPassword = password.toString().trim();
        var authSalt = crypto.randomBytes(UserAuthorization.authSaltLength).toString('hex');
        var authorizationToken_RAW = (authPassword + authSalt);
        var authorizationToken = crypto.createHash('sha256').update(authorizationToken_RAW).digest('hex');
        var authToken = crypto.randomBytes(64).toString('hex');
        return {
            salt: authSalt,
            pass: authorizationToken,
            token: authToken,
            tokenDate: (Date.now() + UserAuthorization.authTokenLifeTime)
        };
    },
    Verify: function(password, userID, dbResult, callback) {
        var userAuthorizationToken_Stored = dbResult[0].userPassword;
        var userAuthorizationSalt_Stored = dbResult[0].authst;
        var userAuthorizationTokenPlain_Local = (password + userAuthorizationSalt_Stored);
        var userAuthorizationToken_Local = crypto.createHash('sha256').update(userAuthorizationTokenPlain_Local).digest('hex');
        if(userAuthorizationToken_Local == userAuthorizationToken_Stored)
        {
            var authToken = crypto.randomBytes(64).toString('hex');
            tokenData.addToken(authToken, userID, function(err, dbResult) {
                if (err) 
                {
                    console.debug(err);
                } 
                else 
                {
                    //AuthToken successfully saved
                    callback(authToken);
                }
            });				
        }
        else
        {
            callback();
        }
    },
    RefreshToken: function (requestToken, refreshCallback) {
        UserAuthorization.VerifyToken(requestToken, function(AuthTokenStatus) {
            if (AuthTokenStatus.isRefreshable == true)
            {
                let authToken = crypto.randomBytes(64).toString('hex');
                tokenData.refreshToken(authToken, requestToken, function(err, dbResult_refresh) {
                    //handle error
                    refreshCallback({isvalid: true, token: authToken});
                });
            }
            else
            {
                refreshCallback({isvalid: false});
            }
        });
    },
    VerifyToken: function(requestToken, verifCallback) {
        tokenData.checkTokenDate(requestToken, function (err, dbResult) {
            if (dbResult.length != 0)
            {
                if ((Date.now()+UserAuthorization.authTokenGracePeriod) >= dbResult[0].authTokenDate)
                {
                    //token is invalid, can't be refreshed
                    verifCallback(
                        {
                            isValid:false, 
                            isRefreshable: false
                        });
                }
                else if (Date.now() >= dbResult[0].authTokenDate)
                {
                    //token is invalid, can be refreshed
                    verifCallback(
                        {
                            isValid:false,
                            isRefreshable: true
                        });
                    //auto token refresh code
                    /*UserAuthorization.RefreshToken(requestToken, function(AuthTokenStatus) {
                        if (AuthTokenStatus.isValid == true)
                        {
                            verifCallback(
                                {
                                    isValid:true,
                                    token: AuthTokenStatus.token
                                });
                        }
                    });*/
                }
                else
                {
                    //token is valid
                    verifCallback(
                        {
                            isValid:true, 
                            isRefreshable: false,
                            userid: dbResult[0].userID
                        });
                }
            }
            else
            {
                //token is invalid
                verifCallback(
                    {
                        isValid:false, 
                        isRefreshable: false
                    });
            }
        });
    }
}
module.exports = UserAuthorization;