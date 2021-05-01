//SPDX-FileCopyrightText: © 2021 Bars Margetsch <barsmargetsch@outlook.com>
//SPDX-License-Identifier: BSD 3-Clause
const crypto = require('crypto');
const db = require('./database');
const xauth_queries = {
    searchForToken: function(token, callback) {
        return db.query('SELECT * FROM users WHERE authToken=?', [token], callback);
    },
    searchForSalt: function(salt, callback) {
        return db.query('SELECT * FROM users WHERE authst=?', [salt], callback);
    },
    searchForEmail: function(email, callback) {
        return db.query('SELECT * FROM users WHERE userEmail=?', [email], callback);
    },
    registerNewUser: function(data, callback) {
        return db.query('INSERT INTO users (userEmail, userPassword, authst, authTokenDate, authToken) VALUES(?,?,?,?,?)', [data.userEmail, data.userPassword, data.userSalt, data.userTokenLifeTime, data.userToken], callback);
    },
    refreshToken: function(token, tokenOld, callback) {
        var tokendate = (Date.now() + xauth_hidden.authTokenLifeTime);
        return db.query('UPDATE users SET authToken=?, authTokenDate=? WHERE authToken=?', [token, tokendate, tokenOld], callback);
    },
    addToken: function(token, email, callback) {
        var tokendate = (Date.now() + xauth_hidden.authTokenLifeTime);
        return db.query('UPDATE users SET authToken=?, authTokenDate=? WHERE userEmail=?', [token, tokendate, email], callback);
    },
    updateUserCredentials: function(data, callback) {
        return db.query('UPDATE users SET userPassword=?, authst=?, authTokenDate=?, authToken=? WHERE userEmail=?', [data.userPassword, data.userSalt, data.userTokenLifeTime, data.userToken, data.userEmail], callback);
    },
};
const xauth_hidden = {
    authSaltLength: 32,
    authTokenLifeTime: 21600000,
    authTokenGracePeriod: 3600000,
    authTokenLength: 64,
    GenerateToken: function(genCallback) {
        let authToken = crypto.randomBytes(xauth_hidden.authTokenLength).toString('hex');
        xauth_queries.searchForToken(authToken, function (err, dbResult) {
            if (dbResult.length != 0)
            {
                //Token exists.
                xauth_hidden.GenerateToken(genCallback);
            }
            else
            {
                //Token is good to go!
                genCallback(authToken);
            }
        });
    },
    GenerateSalt: function(saltCallback) {
        let authSalt = crypto.randomBytes(xauth_hidden.authSaltLength).toString('hex');
        xauth_queries.searchForSalt(authSalt, function (err, dbResult) {
            if (dbResult.length != 0)
            {
                //Salt exists.
                xauth_hidden.GenerateSalt(saltCallback);
            }
            else
            {
                //Salt is good to go!
                saltCallback(authSalt);
            }
        });
    },
    RefreshToken: function (requestToken, refreshCallback) {
        xauth_hidden.GenerateToken(function(token){
            xauth_queries.refreshToken(token, requestToken, function(err, dbResult_refresh) {
                //Not accounting for errors here, since by this point the system would have already hung up.
                refreshCallback({isValid: true, token: token});
            });
        });
    }
};
const xauth_exposed = {
    Register: function(userPassword, userIdentifier, registerCallback) {
        xauth_queries.searchForEmail(userIdentifier, function(err, dbResult){
            if (err)
            {
                console.debug(err);
                registerCallback("internal_database");
            }
            else if (dbResult.length == 0)
            {
                //User does not exist.
                let userPassword_RAW = userPassword.toString().trim();
                xauth_hidden.GenerateSalt(function(salt){
                    let userPasswordSalted_RAW = (userPassword_RAW + salt);
                    let userPasswordSalted_SHA = crypto.createHash('sha256').update(userPasswordSalted_RAW).digest('hex');
                    xauth_hidden.GenerateToken(function(token){
                        xauth_queries.registerNewUser({
                            userEmail: userIdentifier,
                            userPassword: userPasswordSalted_SHA,
                            userSalt: salt,
                            userToken: token,
                            userTokenLifeTime: (Date.now() + xauth_hidden.authTokenLifeTime)
                        }, function(err, regResult){
                            if (err)
                            {
                                registerCallback("internal_database");
                            }
                            else
                            {
                                registerCallback({
                                    registrationValid: true,
                                    userToken: token
                                });
                            }
                        });
                    });	
                });
            }
            else
            {
                //User already exists.
                registerCallback({registrationValid: false});
            }
        });
    },
    Login: function(userPassword, userIdentifier, loginCallback) {
        xauth_queries.searchForEmail(userIdentifier, function(err, dbResult) {
            if (err)
            {
                console.debug(err);
                loginCallback("internal_database");
            }
            else if (dbResult.length != 0)
            {
                //User exists.
                let userPasswordSalted_SHA = dbResult[0].userPassword;
                let userSalt = dbResult[0].authst;
                let userPassword_RAW = userPassword.toString().trim();
                let userPasswordSalted_RAW_EX = (userPassword_RAW + userSalt);
                let userPasswordSalted_SHA_EX = crypto.createHash('sha256').update(userPasswordSalted_RAW_EX).digest('hex');
                if (userPasswordSalted_SHA == userPasswordSalted_SHA_EX)
                {
                    xauth_hidden.GenerateToken(function(token) {
                        xauth_queries.addToken(token, userIdentifier, function(err, dbResult) {
                            if (err) 
                            {
                                console.debug(err);
                                loginCallback("internal_database");
                            } 
                            else 
                            {
                                loginCallback(token);
                            }
                        });
                    });		
                }
                else
                {
                    loginCallback();
                }
            }
            else
            {
                //User does not exist.
                loginCallback();
            }
        });
    },
    Verify: function(requestToken, verifCallback) {
        xauth_queries.searchForToken(requestToken, function (err, dbResult) {
            if (dbResult.length != 0)
            {
                let gracetime = new Date(Date.now().valueOf()+xauth_hidden.authTokenGracePeriod);
                let tokendate = new Date(dbResult[0].authTokenDate);
                if (gracetime > tokendate > Date.now())
                {
                    //Token expired.
                    verifCallback({isValid:false});
                }
                else if (Date.now() >= tokendate)
                {
                    //Token is in a grace period, refresh.
                    xauth_hidden.RefreshToken(requestToken, function(AuthTokenStatus) {
                        if (AuthTokenStatus.isValid == true)
                        {
                            verifCallback({
                                    isValid:true,
                                    userID: dbResult[0].userID,
                                    token: AuthTokenStatus.token,
                                    refreshToken: AuthTokenStatus.token
                                });
                        }
                    });
                }
                else
                {
                    //Token is valid.
                    verifCallback({
                            isValid:true,
                            userID: dbResult[0].userID,
                            token: requestToken
                        });
                }
            }
            else
            {
                //Token is invalid.
                verifCallback({isValid:false});
            }
        });
    },
    Update: function(userPassword, userIdentifier, updateCallback) {
        xauth_queries.searchForEmail(userIdentifier, function(err, dbResult){
            if (err)
            {
                console.debug(err);
                updateCallback("internal_database");
            }
            else if (dbResult.length == 0)
            {
                //User does not exist.
                updateCallback({updateValid: false});
            }
            else
            {
                //User exists.
                let userPassword_RAW = userPassword.toString().trim();
                xauth_hidden.GenerateSalt(function(salt){
                    let userPasswordSalted_RAW = (userPassword_RAW + salt);
                    let userPasswordSalted_SHA = crypto.createHash('sha256').update(userPasswordSalted_RAW).digest('hex');
                    xauth_hidden.GenerateToken(function(token){
                        xauth_queries.updateUserCredentials({
                            userEmail: userIdentifier,
                            userPassword: userPasswordSalted_SHA,
                            userSalt: salt,
                            userToken: token,
                            userTokenLifeTime: (Date.now() + xauth_hidden.authTokenLifeTime)
                        }, function(err, regResult){
                            if (err)
                            {
                                updateCallback("internal_database");
                            }
                            else
                            {
                                updateCallback({
                                    updateValid: true,
                                    userToken: token
                                });
                            }
                        });
                    });	
                });
            }
        });
    }
};
module.exports = xauth_exposed;