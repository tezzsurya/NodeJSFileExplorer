var http = require('http');
var fs = require('fs');

var hostname = 'localhost';
var port = 3000;

var list_dir = require('./list_dir');
var load = require('./load.js');

var server = http.createServer(function(req, res){
  console.log('Request for ' + req.url + ' by method ' + req.method);
  if (req.method == 'GET') {
        var fileUrl = req.url;
        if(req.url=="/") {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            fs.createReadStream('./index.html').pipe(res);
        }
        else if (req.url=="/load.js") {
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            fs.createReadStream('./load.js').pipe(res);   
        }
        else if (req.url.substring(0,9)== '/get_file') {

            var filePath = req.url.substring(15);
            var filePathArray = filePath.split("%20");
            var escapedFilePath = filePathArray[0];
            for(var i=1;i<filePathArray.length;i++) {
                escapedFilePath += (" "+filePathArray[i]);
            }
            var fileNameArray = filePath.split("/");
            var filename = fileNameArray[fileNameArray.length-1];
            res.writeHead(200, {
                // 'Content-Type' : 'application/octet-stream',
                // 'Content-Type' : 'binary',
                'Content-Disposition' : 'inline; filename='+filename,
            });
            fs.createReadStream(escapedFilePath).pipe(res);
        }

        else if (req.url.substring(0,9) != '/list_dir') {
            console.log("entered list_dir");
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<html><body><h1>Error 404: ' + fileUrl + 
                          ' not found</h1></body></html>');
            return;
        }

        else if(req.url.substring(0,9) == '/list_dir') {

            var path = fileUrl.substring(15);
            var dirPathArray = path.split("%20");
            var escapedDirPath = dirPathArray[0];
            for(var i=1;i<dirPathArray.length;i++) {
                escapedDirPath += (" "+dirPathArray[i]);
            }
            console.log("path is "+path);
            console.log("escapedDirpath is "+escapedDirPath);
            list_dir.listDir(escapedDirPath,function (err,list) {
                if(err) console.log(err);
                else {
                    exports.list = list;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify(list));
                    res.end();
                }
                return;
            });    
        }    
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<html><body><h1>Error 404: ' + req.method + 
            ' not supported</h1></body></html>');
  }
});

server.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});