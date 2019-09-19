//npm install express
//npm install ejs

var express = require("express");
var jwt = require("jsonwebtoken");
var auth = require('./auth');

app = express();
var request = require('request');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'su218',   //
  database : 'fintech'
});
connection.connect(); 

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(express.urlencoded({extended : false}));

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get("/", function (request, response) {
    response.render('main');
});

app.get("/design", function (request, response) {
    response.render('design');
});


app.get("/signup", function(request, response){
	response.render('signup');
});

app.get("/main", function(request, response){
    response.render('main');
});

app.post('/getUser', auth, function(req, res){
    console.log(req.decoded);
    var selectUserSql = "SELECT * FROM fintech.user WHERE user_id = ?";
    var userseqnum = "";
    var userAccessToken = "";
    connection.query(selectUserSql, [req.decoded.userId], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            console.log(result);
            userseqnum = result[0].userseqnum;
            userAccessToken = result[0].accessToken;
            console.log("parameter : ", userseqnum, userAccessToken);

            var qs = "?user_seq_no=" + userseqnum
            option = {
                url : "https://testapi.open-platform.or.kr/user/me"+qs,
                method : "GET",
                headers : {
                    "Authorization" : "Bearer "+ userAccessToken
                },
            }
            request(option, function (error, response, body) {
                console.log(body);
                if(error){
                    console.error(error);
                    throw error;
                }
                else {
                    var responseObj = JSON.parse(body);
                    res.json(responseObj);
                }
            });
        }
    })
})

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
			client_id: "l7xx3d9f8f7f5978488da2fb458cb6e2411b", //
			client_secret: "a6998da5904e46518e21c8a92188a932", //
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
    console.log(userId, userPwd);
    res.json(1);
})

app.get("/signup", function (request, response) {
    console.log(request);
    console.error(request.body);
    response.render('signup');
});

app.get("/sayHello", function (request, response) {
	var user_name = request.query.user_name;
	response.end("Hello " + user_name + "!");
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/balance', function(req, res){
    var qs = "?fintech_use_num=199158970057879805326728&tran_dtime=20190918174737"
    option={
        url : "https://testapi.open-platform.or.kr/v1.0/account/balance"+qs,
        method : "GET",
        headers : {
            "Authorization" : "Bearer 66a7f53e-e64a-4e78-953d-7458a8eb6326"
        },
    }
    request (option, function (error, response, body){
        console.log(body);
        if(error){
            console.error(error);
            throw err;
        }
        else{
            console.log(body);
            res.json('??');
        }
    });
})

app.post('/login', function (req, res) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    console.log(userEmail, userPassword);

    var sql = "SELECT * FROM user WHERE user_id = ?";
    connection.query(sql, [userEmail], function (error, results) {
      if (error) throw error;  
      else {

        console.log(userPassword, results[0].user_password);
        if(userPassword == results[0].user_password){
            jwt.sign(
                {
                    userName : results[0].name,
                    userId : results[0].user_id,
                    comment : "안녕하세요"
                },
                "abcdefg123456",
                {
                    expiresIn : '1d',
                    issuer : 'fintech.admin',
                    subject : 'user.login.info'
                },
                function(err, token){
                    console.log('로그인 성공', token)
                    res.json(token)
                }
            )            
        }
        else {
            res.json('등록정보가 없습니다');
        }
      }
	});
})

app.post('/signup', function(req, res){
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var accessToken = req.body.accessToken;
    var refreshToken = req.body.refreshToken;
    var useseqnum = req.body.useseqnum;
    console.log(userEmail, userPassword, accessToken, refreshToken, useseqnum);
    var sql = "INSERT INTO `fintech`.`user` " +
    "(`user_id`, `user_password`, `phone`, `accessToken`, `refreshToken`, `userseqnum`)"+
    " VALUES (?,?,?,?,?,?)";
    connection.query(sql,[userEmail,
        userPassword,
        "010",
        accessToken ,
        refreshToken,
        useseqnum ],function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            res.json(1);
        }
    })
})

app.listen(port);
console.log("Listening on port ", port);
