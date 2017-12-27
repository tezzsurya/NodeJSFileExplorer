function myfunction(path) {	
	var pid = document.getElementById("pid");
    var dirPathArray = path.split("%20");
    var escapedHeaderPath = dirPathArray[0];
    for(var i=1;i<dirPathArray.length;i++) {
        escapedHeaderPath += (" "+dirPathArray[i]);
    }
	pid.innerHTML = escapedHeaderPath=="" ? "/" : "/"+escapedHeaderPath+"/";

	var parent = path.split("/");
	var parentPath = "";
	for(var i=0;i<parent.length-1;i++) {
		parentPath += (parent[i]+"/");
	}
	if(parent.length==1) parentPath = "";
	else parentPath = parentPath.substring(0,parentPath.length-1);

	var fullPath = "http://localhost:3000/list_dir?path=/"+path;
	fetch(fullPath, {
	}).then(function(response) {
		return response.json();
	}).then(function(data) {
		var list_div = document.getElementById('list_div');
		list_div.innerHTML = "";
		//Adding back function
		var back = document.createElement('a');
		back.innerHTML = "../";
		var backClick  = function (anypath) {
			back.onclick = function() {
				myfunction(anypath);
			};
		};
		backClick(parentPath);
		list_div.appendChild(back);
		var br1 = document.createElement("br");
		list_div.appendChild(br1);

		for (var i = 0; i < data.length; i++) {
	      var listItem = document.createElement('a');
	      listItem.innerHTML = data[i]['name'];
	      if(data[i]['type']=="Directory") {		//item is directory. so there will be onclick function
	      	var path1 = (path=="") ? data[i]['name'] : path+"/" + data[i]['name'];
	      	var escapedPath = path1.split(" ");
	      	var pathWithoutSpaces = escapedPath[0];
	      	for(var j=1;j<escapedPath.length;j++) {
	      		pathWithoutSpaces += ("%20"+escapedPath[j]);
	      	}
	      	var addOnClick = function(path2) {
	      		listItem.onclick = function() {
	      			myfunction(path2);		      		
	      		};
	      	};
	      	addOnClick(pathWithoutSpaces);
	      }
	      else if(data[i]['type']=="File") {
	      	listItem.setAttribute("target","_blank");
	      	var tempPath = path=="" ? data[i]['name'] : path+"\/"+data[i]['name'];
	      	listItem.setAttribute("href", "get_file?path=/"+tempPath);	
	      }	      
	      list_div.appendChild(listItem);
	      var br = document.createElement("br");
		  list_div.appendChild(br);
	    }
	}).catch(function(err) {console.log(err)});
}
