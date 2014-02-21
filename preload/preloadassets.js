var canvas = document.getElementById("Canvas");
stage = new createjs.Stage(canvas);
var manifest;
var preload;
var progressText = new createjs.Text("100% Loaded", "20px Arial", "#000000");
progressText.x = 300 - progressText.getMeasuredWidth() / 2;
progressText.y = 20;
stage.addChild(progressText);
stage.update();

function setupManifest() {
    manifest = [{
        src:  "collision.js",
        id: "myjsfile"
    }, {
        src: "logo.png",
        id: "logo"
    }, {
        src:  "ForkedDeer.mp3",
        id: "mp3file"
    }

    ];
    for(var i=1;i<=13;i++)
        manifest.push({src:"c"+i+".png"})
}

function startPreload() {
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);          
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

function handleFileLoad(event) {
    console.log("A file has loaded of type: " + event.item.type);
	if(event.item.id == "logo"){
	    console.log("Logo is loaded");
		//create bitmap here
	}
}

function loadError(evt) {
    console.log("Error!",evt.text);
}


function handleFileProgress(event) {
    progressText.text = (preload.progress*100|0) + " % Loaded";
    stage.update();
}

function loadComplete(event) {
    console.log("Finished Loading Assets");
}
setupManifest();
startPreload();