var canvas = document.getElementById("Canvas");
stage = new createjs.Stage(canvas)
var ship;
var invader;
var stagewidth = 600;
var stageheight = 600;
var shipwidth = 93;
var shipheight = 125;
var invaderArray = [];
var bulletArray = [];
var invaderWidth = 32;
var leftBounds = 25;
var rightBounds = 575;
var invaderSpeed = 6;
var changeDirection = false;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_SPACE = 32;
var moveLeft = false;
var moveRight = false;
var startText;
var canfire = true;
var alphaThreshold = 0.75;
var bullet;
var gameStarted = false;

function setup() {
    createjs.Sound.registerPlugins([ createjs.HTMLAudioPlugin]); //Set plugin to use HTMLAudio 
	createjs.Sound.alternateExtensions = ["ogg"]; //If it cannot load .mp3 it will try to load .ogg instead
    drawBackground();
	setupManifest();
    startPreload();
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
}



function setupManifest() {
    manifest = [ 
	{
        src: "./images/invader.png",
        id: "invader"
    }, {
        src:  "./images/ship.png",
        id: "ship"
    },
	{
        src:  "./images/bullet.png",
		id: "bullet"
    }
];
}

function startPreload(){
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);  
    preload.on("fileload", handleFileLoad);	
    preload.on("complete", loadComplete);
    preload.loadManifest(manifest);
}

function handleFileLoad(event) {
   if(event.item.id == "invader"){
    invader = new createjs.Bitmap(event.result);
   }
   if(event.item.id == "ship"){
    ship = new createjs.Bitmap(event.result);
    ship.x = stagewidth / 2 - shipwidth / 2;
    ship.y = stageheight - shipheight;
   }
   if(event.item.id == "bullet"){
    bullet = new createjs.Bitmap(event.result);
   }
   
}

function loadComplete(event) {
    startText = new createjs.Text("Click To Start", "50px Arial", "#FFFFFF");
    startText.x = stagewidth/2 - startText.getMeasuredWidth()/2;
    startText.y = stageheight/2 - startText.getMeasuredHeight()/2;
    stage.addChild(startText);
    stage.update();
    stage.on("stagemousedown",startGame,null,false);
	
}
function startGame(event){
     
	 event.remove();
	 createjs.Ticker.addEventListener("tick", tick);
     createjs.Tween.get(startText)
    .to({x:-500},1500)
    .call(initGraphics);
       
}

function initGraphics(){
	stage.addChild(ship);
	setupInvaders();
	gameStarted = true;
}
function drawBackground() {
    var rect = new createjs.Shape();
    rect.graphics.beginFill("#000").drawRect(0, 0, 600, 600);
    stage.addChild(rect);

    for (var i = 0; i < 180; i++) {
        var randNumX = Math.floor(Math.random() * stagewidth);
        var randNumY = Math.floor(Math.random() * stageheight);
        var circle = new createjs.Shape();
   
        circle.graphics.beginFill("#FFF").drawCircle(randNumX, randNumY, 2);
        stage.addChild(circle);
    }

}




function setupInvaders() {
   
    var xPos = 148;
    var yPos = 18;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 7; j++) {
            tempInvader = invader.clone()
            tempInvader.x = xPos + j * 45
            tempInvader.y = yPos + i * 46;
            stage.addChild(tempInvader);
            invaderArray.push(tempInvader);
        }
    }
}

function handleKeyDown(e) {
    switch (e.keyCode) {
        case KEYCODE_LEFT:
        case 65:  // A
            moveLeft = true;
            break;
        case KEYCODE_RIGHT:
        case 68:  // D
            moveRight = true;
            break;
    }
 
}

function handleKeyUp(e) {
    switch (e.keyCode) {
        case KEYCODE_SPACE:
        case 87:  // W
            fireBullet();
            break;
        case KEYCODE_LEFT:
        case 65:  // A
            moveLeft = false;
            break;
        case KEYCODE_RIGHT:
        case 68:  // D
            moveRight = false;
            break;
            
    }
}
function fireBullet(){
    if(canfire){
	
    var tempBullet = bullet.clone();
    tempBullet.y = stageheight - shipheight - 30;
    tempBullet.x = ship.x + shipwidth/2;
    bulletArray.push(tempBullet);
    stage.addChild(tempBullet);
    canfire = false;
	createjs.Sound.play("./sound/laser.mp3");
     setTimeout(function(){canfire = true},750);   
    }
    
}
function tick(){
if(gameStarted){
     var invaderLength = invaderArray.length;
     var bulletLength = bulletArray.length;
    if (moveLeft) {
        ship.x -= 10;
     }else if (moveRight) {
        ship.x += 10;
        }
    
    for(var i = 0; i < invaderLength; i++){
        invaderArray[i].x += invaderSpeed;
        
        if(invaderArray[i].x > rightBounds - invaderWidth || invaderArray[i].x < leftBounds){
            changeDirection = true;
        }
    }    
    if(changeDirection){
        invaderSpeed *= -1;
        for(var j=0;j < invaderLength; j++){
            invaderArray[j].y += 10;
        }
        changeDirection = false;    
    }
    if(bulletArray.length){
    for(var i=0;i<bulletLength;i++){
        bulletArray[i].y -= 10;
    }
    }
    checkCollisions();
    checkWin();
	}
    
    stage.update();
}

function checkCollisions(){
       if (bulletArray.length) {
        for (var i = invaderArray.length - 1; i >= 0; i--) {
            for (var j = bulletArray.length - 1; j >= 0; j--) {
                var collision = ndgmr.checkPixelCollision(invaderArray[i], bulletArray[j],alphaThreshold) ;
                if(collision){
                    stage.removeChild(invaderArray[i]);
                    invaderArray.splice(i, 1);
                    stage.removeChild(bulletArray[j]);
                    bulletArray.splice(j, 1);                    
                }
            }
        }
    }
    
    for(var i=0;i<invaderArray.length;i++){
         var collision = ndgmr.checkPixelCollision(invaderArray[i], ship,alphaThreshold) ;
         if(collision){
            doGameOver();                    
         }
    }
    
}
function checkWin(){
    if(invaderArray.length == 0){
        doGameOver();
    }
    
}
function doGameOver(){
    createjs.Ticker.removeEventListener("tick", tick);
    var gameOverText = new createjs.Text("Game Over", "50px Arial", "#FFFFFF");
    gameOverText.x = stagewidth/2 - gameOverText.getMeasuredWidth()/2;
    gameOverText.y = stageheight/2 - gameOverText.getMeasuredHeight()/2;
    stage.addChild(gameOverText);
    
}
setup();