var fs = require('fs');

exports.listDir = function(path,callback) {
	var listOfFilesFolders = [];		
	var error;
	fs.stat(path, function (err, stats) {
		console.log("err in listDir is "+err);
		// if(err==null && err.code=='ENOENT') {
		// 		error = "File Doesn't exist";
		// 		console.log("entered ENOENT");
		// 		callback(error);
		// 	}
		if(err!=null) {
			if(err.code=="EACCES") {
				error = "Permission Denied to access File";
				return callback(error);
			}
			if(err.code!='EEXIST') {
				error = "File Doesn't exist";
				return callback(error);
			}
		}
		else {
			
			if(stats.isFile()) {
				error = "This is a File";
				return callback(error);
			}
			if(stats.isDirectory()) {
				fs.readdir(path, function (err, items) {					
				if(err) return callback(err);
				var x = 0;
				items.forEach(function(item) {
					    fs.stat(path +"/"+item, function (err, stats) {
							if(err) return callback(err);
							if(stats.isFile()) {
								temp = {};
								temp['type'] = 'File';
								temp['name'] = item;
								temp['size'] = stats['size'];
								listOfFilesFolders.push(temp);
							}
							else if(stats.isDirectory()) {
								temp = {};
								temp['type'] = 'Directory';
								temp['name'] = item;
								temp['size'] = stats['size'];
								listOfFilesFolders.push(temp);	
							}
				            x++;
				            if(x == items.length){
				            	return callback(null,listOfFilesFolders);
				            }
						});
					});
				});				
			}	
		}
	});
};