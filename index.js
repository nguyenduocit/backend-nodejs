var http = require('http');
http.createServer(function(req, res) {
    res.writeHead(200, {"content-type": "text/plain; charset=utf8"});
    res.write("Server da ket noi thanh cong");
    res.end();
}).listen(3000);