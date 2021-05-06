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
        var date = new Date();
        var stringDate = ((date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate()));
        https.get({
            hostname: 'lukkarit.oamk.fi',
            path: '/kalenteri.php', //?date=2021-05-03&delta=+0week --> ?date='+stringDate+'&delta=+'+weekDelta+'week';
            method: 'GET',
            headers: {
                'Cookie' : 'PHPSESSID='+cookie,
            }
        }, function(http_res) {
            //Works but if there is more than one lecture a day it only gets the first one.
            //Possibly an issue with clDay[^\0]*?<\/dd> aborting earlier than needed.
            var data = "";
            http_res.on("data", function (chunk) {data+=chunk;});
            http_res.on("end", function () {
                //clDay[^\0]*?<\/dd>    <-- gets the course info (time, name, ID, Group, Teachers)
                //clDay="(.*?)">        <-- gets dates
                /*
                Course data regex:
                <dt>(.*?)<\/dt>         <-- gets the time
                <b>(.*?)<\/b>           <-- distance learning (etäopetus)
                <br\/>(.*?)<br\/>       <-- Group 1 is the course name (and teachers name but we gonna ignore that)
                <p>(.*?)<\/p>           <-- Gets course data
                    <br\s?\/>           <-- This one goes into a string.split(); as an argument to separate entries
                */
                var regexp = /clDay[^\0]*?<\/dd>/g;
                // <dt(.*?)<\/dd        <-- og
                let course_big = data.match(regexp);
                regexp = /clDay="(.*?)">/g;
                let daytimes = data.matchAll(regexp);
                //
                let obj = {};
                let i = 0;
                let courseobj = {}
                for (const element of course_big) {
                    regexp = /clDay="(.*?)">/g;
                    let coursedate = element.matchAll(regexp);
                    regexp = /<dt>(.*?)<\/dt>/g;
                    let coursetime = element.matchAll(regexp);
                    console.log(coursetime);
                    regexp = /<b>(.*?)<\/b>/g;
                    let learnmode = element.matchAll(regexp);
                    regexp = /<br\/>(.*?)<br\/>/g;
                    let coursename = element.matchAll(regexp);
                    for (const a of coursedate) {
                        courseobj[a[1]] = {};
                        for (const b of coursetime) {
                            i++;
                            if (courseobj[a[1]][i.toString()] == undefined)
                            {
                                courseobj[a[1]][i.toString()] = [];
                            }
                            for (const c of learnmode) {
                                let counter = 0;
                                let tempobj = {courseTime: b[1], courseMode: c[1]};
                                for (const d of coursename) {
                                    if (counter == 0)
                                    {
                                        tempobj["courseName"] = d[1];
                                    }
                                    if (counter == 1)
                                    {
                                        tempobj["courseTeachers"] = d[1];
                                    }
                                    counter++;
                                }
                                courseobj[a[1]][i.toString()].push(tempobj);
                            }
                        }
                    }
                    
                }
                for (const x of daytimes) {
                    if (courseobj[x[1]] == undefined)
                    {
                        courseobj[x[1]] = {};
                    }
                }
                console.log(courseobj);
            });
        });
    });
});
module.exports = router;