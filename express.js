//
//npm install express
//npm install ejs

var express = require("express"),
app = express();
var request = require("request");

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get("/", function (request, response) {
	response.render('main');
});

app.get("/design", function(request, response){
	response.render('design');
});

app.get("/signup", function(request, response){
	response.render('signup');
});

app.get("/authResult", function(req, res){
	var authCode = req.query.code;
	console.log(authCode);
	option = {
		url : "https://testapi.open-platform.or.kr/oauth/2.0/token",
		method :"POST",
		headers : {
		},
		form : {
			code : authCode,
			client_id: "l7xx3d9f8f7f5978488da2fb458cb6e2411b",
			client_secret: "a6998da5904e46518e21c8a92188a932",
			redirect_uri: "http://localhost:3000/authResult",
			grant_type : "authorization_code"
		}
	}
	request(option, function(error,response, body){
		console.log(body);
		if(error){
			console.error(error);
			throw error;
		}
		else{
			var accessTokenObj = JSON.parse(body);
			console.log(accessTokenObj);
			res.render('resultChild', {data : accessTokenObj});
		}
	})
});

app.get('/sendUserData', function(req, res){
	var userId = req.query.userId;
	var userPwd = req.query.password;
	console.log(userId,userPwd);
	res.json(1);
});

app.get("/sayHello", function (request, response) {
	var user_name = request.query.user_name;
	response.end("Hello " + user_name + "!");
});


app.post('/signup', function(req, res){
	var userEmail = req.body.userEmail;
	var userPassword = req.body.userPassword;
	var accessToken = req.body.accessToken;
	var refreshToken = req.body.refreshToken;
	var useseqnum = req.body.useseqnum;

	var sql = "INSERT INTO 'new_schema'.'user' {'user_id', 'user_password', 'phone', 'accessToken', 'refreshToekn', 'useseqnum'} " +
	" VALUES (?,?,?,?,?,?,)";
	RTCPeerConnection.query(sql,[userEmail,
		userPassword,
		"010",
		accessToken,
		refreshToken,
		useseqnum ], function(err, result){
		if(err){
			console.error(err);
			throw err;
		}
		else {

		}
	})
})

app.listen(port);

console.log("Listening on port ", port);

