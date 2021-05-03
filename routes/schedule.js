var express = require('express');
var router = express.Router();
const UserAuthorization = require('../xauth');
const xres = require('../xresponse');
var https = require('https');

router.get('/get', function(req, res) {
    https.get("https://lukkarit.oamk.fi/muodostaKori.php?1=1&g[]=DIN20SP", function(response) {
        //var asd = response.headers['set-cookie'];
        var headers_dev = response.headers;
        var cookie_header = headers_dev['set-cookie'].toString();
        var cookie = cookie_header.match('\=(.*?)\;')[1];
        var date = "";
        https.get({
            hostname: 'lukkarit.oamk.fi',
            path: '/kalenteri.php', //?date=2021-05-03&delta=+0week
            method: 'GET',
            headers: {
                'Cookie' : 'PHPSESSID='+cookie,
            }
        }, function(http_res) {
            var contents = "";
            http_res.on("data", function (chunk) {contents+=chunk;});
            http_res.on("end", function () {
                let _times = [];
                let _RAW = [];
                //let _course = new ArrayList();
                let _tempInfoStorage = "";

                for(let i = 0; i < (contents.length-1); i++)
                {
                    if(contents[i] == 'c' && contents[i + 1] == 'l' && contents[i + 2] == 'D' && contents[i + 3] == 'a' && contents[i + 4] == 'y')
                    {
                        i = i+7; //jump over the "cDay"
                        //10:00 - 12:00
                        //clDay=\"25.08.2020\"
                        for (let _time = i; _time < contents.length; _time++)
                        {
                            if (contents[_time] != '"')
                            {
                                _tempInfoStorage += contents[_time];
                            }
                            else
                            {
                                break;
                            }
                        }
                        _times.push(_tempInfoStorage);
                        _tempInfoStorage = "";

                        for (let _time = i; _time < contents.length; _time++)
                        {
                            if (contents[_time] == '<' && contents[_time + 1] == 'd' && contents[_time + 2] == 't' && contents[_time + 3] == '>')
                            {
                                _time = _time + 4; //jump over the "<dt>"

                                for (let _timeEXP = _time; _timeEXP < (_time + 13); _timeEXP++)
                                {
                                    _tempInfoStorage += contents[_timeEXP];
                                }
                                _times.push(_tempInfoStorage);
                                _tempInfoStorage = "";
                            }
                            if (contents[_time] == 'c' && contents[_time + 1] == 'l' && contents[_time + 2] == 'D' && contents[_time + 3] == 'a' && contents[_time + 4] == 'y')
                            {
                                break;
                            }
                        }
                    }

                    if(contents[i] == '<' && contents[i+1] == 'b' && contents[i+2] == 'r')
                    {
                        i = i + 5; //jumps over <br/>
                        _tempInfoStorage = "";
                        for (let _data = i; contents[_data]!= '<'; _data++)
                        {
                            _tempInfoStorage += contents[_data];
                        }
                        if (_tempInfoStorage != "")
                        {
                            _RAW.push(_tempInfoStorage);
                        }
                        _tempInfoStorage = "";
                    }

                    if (contents[i] == '<' && contents[i + 1] == '/' && contents[i + 2] == 'p' && contents[i + 3] == '>')
                    {
                        i = i + 4; //jump over the "</p>"
                        _tempInfoStorage = "</p>";
                        _RAW.push(_tempInfoStorage);
                        _tempInfoStorage = "";
                    }
                }
                //----------------------------------------
                let _courseStepSV = 0;
                //

                let _temp = Date.now();

                let _localJSONTest = [];
                let _json = "";
                let _currentTime = "";

                //
                for (let i = 0; i < _times.length; i++)
                {
                    if(_times[i].toString().includes(".")!=true)
                    {
                        let tempTimeSplit = _times[i].toString().split(" - ");

                        _json += _currentTime + "#" + tempTimeSplit[0] + "#" + tempTimeSplit[1]; //_times[i].toString() + "#";

                        for (let _courseStep = _courseStepSV; _courseStep < _RAW.length; _courseStep++)
                        {
                            if (_RAW[_courseStep].toString() != "</p>")
                            {
                                _json += "#" + _RAW[_courseStep].toString();
                            }
                            else
                            {
                                _courseStepSV = _courseStep + 1;
                                break;
                            }
                        }
                        _localJSONTest.push(_json);
                        _json = "";
                    }
                    else
                    {
                        _currentTime = _times[i].toString();
                    }
                }
                //-------------------------------------------------------------------------------------
                for (const x of _localJSONTest)
                {
                    console.log(x);
                }
                //-------------------------------------------------------------------------------------
                res.send(_localJSONTest);
            });
        });
    });
});
module.exports = router;