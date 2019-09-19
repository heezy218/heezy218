//terminal
//npm install request
//npm init

var request = require("request");

request('https://testapi.open-platform.or.kr/user/me?user_seq_no=1100035493', function(error, response, body){
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body); // Print the HTML for the Google homepage
});