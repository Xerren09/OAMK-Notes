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
            path: '/kalenteri.php?date=2021-04-19&delta=+1week',
            method: 'GET',
            headers: {
                'Cookie' : 'PHPSESSID='+cookie,
            }
        }, function(http_res) {
            var data = "";
            http_res.on("data", function (chunk) {data+=chunk;});
            http_res.on("end", function () {
                //console.log(data);
                //<dt(.*?)<\/dd/g       <-- gets the course info (time, name, ID, Group, Teachers)
                //clDay="(.*?)">        <-- gets dates
                /*
                Course data regex:
                <dt>(.*?)<\/dt>         <-- gets the time
                <b>(.*?)<\/b>           <-- distance learning (etäopetus)
                <br\/>(.*?)<br\/>       <-- Group 1 is the course name (and teachers name but we gonna ignore that)
                <p>(.*?)<\/p>           <-- Gets course data
                    <br\s?\/>           <-- This one goes into a string.split(); as an argument to separate entries
                */
                var regexp = /<dt(.*?)<\/dd/g;
                let course_big = data.match(regexp);
                regexp = /clDay="(.*?)">/g;
                let daytimes = data.match(regexp);
                //
                regexp = /<dt>(.*?)<\/dt>/g;
                let coursetime = course_big[0].matchAll(regexp);
                regexp = /<b>(.*?)<\/b>/g;
                let learnmode = course_big[0].matchAll(regexp);
                regexp = /<br\/>(.*?)<br\/>/g;
                let coursename = course_big[0].matchAll(regexp);
                //
                console.log(course_big);
                console.log(daytimes);
                //console.log(coursetime[1]);
                for (const m of coursetime) {
                    console.log(m[1]);
                }
                console.log(learnmode);
                console.log(coursename);
                for (const m of coursename) {
                    console.log(m[1]);
                }
            });
        });
    });
});
module.exports = router;