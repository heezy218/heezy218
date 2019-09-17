var http = require("http");

http.createServer(function(req, res) {
    var doby = "hello server";
    console.log("request!");
    res.setHeader('content_Type', 'text/plain; charset=htf-8');
    res.end("안녕하세요");
}).listen(3000);