var request = require("request");
var parser = require('xml2js');

//terminal : npm i xml2js

request('http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109', function(error, response, body){
    /*parser.parseString(body, function (err, jsonData) {
        console.log(body);
        console.log(jsonData);
        callback(jsonData.rss.channel[0].item[0].description[0].header[0].wf[0]);
    })*/
    parser.parseString(body, function(err, jsonData){
        console.log(jsonData.rss.channel[0].item[0].description[0].header[0].wf[0]);
    })
});