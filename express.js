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

app.get("/design", function(requset, response){
	response.render('design');
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

