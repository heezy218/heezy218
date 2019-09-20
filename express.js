//npm install express
//npm install ejs
//npm install jwt??제이슨토큰머시기설치

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

app.use(express.json());    //json 토큰 사용
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

app.get("/balance", function(request, response){
    response.render('balance');
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


app.post('/withdrawQR', auth, function(req, res){
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
            userseqnum = result[0].userseqnum;
            userAccessToken = result[0].accessToken;
            option = {
                url : " https://testapi.open-platform.or.kr/v1.0/transfer/withdraw",
                method : "POST",
                headers : {
                    "Authorization" : "Bearer "+ userAccessToken,
                    "Content-Type" : "application/json"
                },
                json : {
                        "dps_print_content": "널앤서",
                        "fintech_use_num": "199158970057879805324504",
                        "tran_amt": "11000",
                        "tran_dtime": "20190918174737"
                }
            }
            request(option, function (error, response, body) {
                console.log(body);
                if(error){
                    console.error(error);
                    throw error;
                }
                else {
                    var responseObj = body;
                    if(responseObj.rsp_code== "A0002" || responseObj.rsp_code== "A0000") {
                        res.json(1);
                    }
                    else{
                        res.json(2);
                    }
                }
            });
        }
    })
})

app.get("/deposit", function(req, res){
    res.render('deposit');
})

app.post("/deposit", function(req, res){
    var request = require("request");
    var options = { method: 'POST',
        url: 'https://testapi.open-platform.or.kr/v1.0/transfer/deposit',
         headers: 
         { 'cache-control': 'no-cache',
            Connection: 'keep-alive',
           'Content-Length': '316',
           'Accept-Encoding': 'gzip, deflate',
           Host: 'testapi.open-platform.or.kr',
          'Postman-Token': '66842f36-9695-4d01-8c25-590f7912fe45,8780c563-c511-416d-880f-43615f53b4f3',
          'Cache-Control': 'no-cache',
          Accept: '*/*',
          'User-Agent': 'PostmanRuntime/7.17.1',
          'Content-Type': 'application/json',
           Authorization: 'Bearer 6957778c-02f8-4963-9ee9-41491d27fbf7' },
         body: 
         { wd_pass_phrase: 'NONE',
           wd_print_content: '환불금액',
           name_check_option: 'on',
           req_cnt: '1',
           req_list: 
           [ { tran_no: '1',
                fintech_use_num: '199158970057879805324504',
                print_content: '쇼핑몰환불',
                tran_amt: '500' } ],
           tran_dtime: '20160310101921' },
         json: true };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);  
            console.log(body);
        console.log("안녕????");
    });
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

app.get('/qrcode', function(req, res){
    res.render('qrcode');
})

app.get('/qr', function(req, res){
    res.render('qrcodeReader');
})

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/balance', auth, function(req, res){
    var finsenum = req.body.finNum;
    var selectUserSql = "SELECT * FROM fintech.user WHERE user_id = ?";
    connection.query(selectUserSql, [req.decoded.userId], function(err, result){
        var accessToken = result[0].accessToken;
        var qs = "?fintech_use_num=" + finsenum +"&tran_dtime=20190918174737"
        option={
            url : "https://testapi.open-platform.or.kr/v1.0/account/balance"+qs,
            method : "GET",
            headers : {
                "Authorization" : "Bearer " + accessToken
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
                var resultObj = JSON.parse(body);
                res.json(resultObj);
            }
        });
    })
})


app.post('/transactionList', auth, function(req, res) {
    var finseqnum = req.body.finNum;
    var selectUserSql = "SELECT * FROM fintech.user WHERE user_id = ?";
    connection.query(selectUserSql, [req.decoded.userId], function(err, result){
        var accessToken = result[0].accessToken;
        var qs = "?fintech_use_num=" + finseqnum +
        "&inquiry_type=A" +
        "&from_date=20190101" + //
        "&to_date=20190101" +   //
        "&sort_order=D" +
        "&page_index=0" +  //키 컬럼      
        "&tran_dtime=20190918174737"
        option = {
            url : "https://testapi.open-platform.or.kr/v1.0/account/transaction_list"+qs,   //
            method : "GET",
            headers : {
                "Authorization" : "Bearer " + accessToken
            },
        }
        request(option, function (error, response, body) {
            console.log(body);
            if(error){
                console.error(error);
                throw error;
            }
            else {
                console.log("으ㅏㄹㄴㅇㄻ너알먼이러만ㅇㄱ놈니");
                console.log(finseqnum);
                console.log(body);
                var resultObj = JSON.parse(body);
                res.json(resultObj);
            }
        });
    })
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
