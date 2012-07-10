var OPML = [];

function parseOPML(e){
	var opml = e.target.result;
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(opml,"text/xml");
	allOutlines = xmlDoc.getElementsByTagName("body")[0].childNodes;
	OPML = interpreteOPML(allOutlines);
	showOPML();
}

function interpreteOPML(Outlines){
	var tempOPML = [];
	for (var i = 0; i < Outlines.length; i++){
		if (Outlines[i].nodeType !== 3){
			tempOPML.push({text: Outlines[i].getAttribute("text"),children: interpreteOPML(Outlines[i].childNodes) });
		}
	}
	return tempOPML;
}

function createItems(myObject){
	var list = document.createElement("ul");
	for (var i = 0; i < myObject.length; i++){
		var item = document.createElement("li");
		//item.classList.add("hide");
		var text = document.createTextNode(myObject[i].text);
		item.appendChild(text);
		list.appendChild(item);
		list.appendChild(createItems(myObject[i].children));
	}
	return list;
}

function showOPML(){
	var list = createItems(OPML);
	document.body.appendChild(list);
	// $("body > ul > li").addClass("top").removeClass("hide");
	// $("li").click(function(){
	// 		$(this).next().contents().find("li").addClass("hide");
	// 		$(this).next().children("li").removeClass("hide");
	// });
}

function handleFiles(files){
	f = files[0];
	myreader = new FileReader();
	myreader.onload = function(e) {
		parseOPML(e);
	};
	myreader.readAsText(f);

remove_dropzone();
}

function remove_dropzone(){
	var dropzone = document.getElementById("dropzone");
	dropzone.parentNode.removeChild(dropzone);
}

function drop(e){
	e.preventDefault();
	var dropzone = document.getElementById("dropzone");
	document.getElementById("dropzone").classList.remove("active");
	var dt    = e.dataTransfer;
	var files = dt.files;
	handleFiles(files);
	return false;
}

function dragenter(e) {
	document.getElementById("dropzone").classList.add("active");
	e.preventDefault();
}

function dragexit(e){
	document.getElementById("dropzone").classList.remove("active");
	e.preventDefault();
}

function run(e){
	var dropzone = document.getElementById("dropzone");
	dropzone.addEventListener("dragenter", dragenter, false);
	dropzone.addEventListener("dragexit", dragexit, false);
	dropzone.addEventListener("drop", drop, false);
}

document.addEventListener("DOMContentLoaded",run);