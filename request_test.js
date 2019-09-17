//terminal
//npm install request
//npm init

var request = require("request");

request('http://www.naver.com', function(error, response, body){
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body); // Print the HTML for the Google homepage
});