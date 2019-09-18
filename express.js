//
//npm install express
//npm install ejs

var express = require("express"),
app = express();

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
	var authResult = req.query.code;
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
		res.json(body);
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

app.listen(port);

console.log("Listening on port ", port);

