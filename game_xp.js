// Canvas element
var canvas = document.getElementById("canvas");
const context = document.querySelector("canvas").getContext("2d");
context.canvas.height = 600;
context.canvas.width = 1400;

// Initial conditions
let frameCount = 1;
let obCount = frameCount;
// const obXCoors = [];
var obXact = 1390;
var obCol = 100;

// Variables
var demerits = 0;
var token = 0;
var kill = 1;
var paused = false;

// Scret codes
cheat = localStorage.getItem('cheat');

// Variable text / images
var dcount = document.getElementById("dem"); dcount.value = 0;
var lvl = document.getElementById("off"); lvl.value = "Model Mid";
var loc = document.getElementById("loc"); loc.value = "Rotunda";
var bg=document.getElementById("bg1");
var pic = [];
var pic2 = [];

// Player / obstacle
pic=document.getElementById("pic");
pic2=document.getElementById("danger");
	
// Audio
var music = document.getElementById("myAudio");
var sound = document.getElementById("yourAudio");
var oof = document.getElementById("hisAudio");
var boing = document.getElementById("herAudio");
var yay = document.getElementById("itsAudio");

const square = {

  height: 125,
  jumping: true,
  width: 125,
  x: 0,
  xVelocity: 1,
  y: 0,
  yVelocity: 0
};

const notsquare = {
	
	height: 125,
	jumping: false,
	width: 125,
	x: obXact,
	xVelocity: -1,
	y: 0,
	yVelocity: 0
};

// Obstacles
const nextFrame = () => {
	frameCount++;
	
	/*for (let i = 0; i < obCount; i++) {
		obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
		obXCoors.push(obXCoor);
	}*/
	
	obXact = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
}

// Control
const controller = {
	left: false,
	right: false,
	up: false,
	esc: false,
	keyListener: function (event) {
		var key_state = (event.type == "keydown") ? true : false;

		switch (event.keyCode) {
			case 38:
			controller.up = key_state;
			break;
			case 27:
			controller.esc = key_state;
			break;
		}
	
		if (controller.esc) {
			menu();
		}
	}
}

// Game over
function over() {
	kill = 0;
	document.getElementById('field_0').style.display='none';
	document.getElementById('field_1').style.display='block';
	music.pause();
	sound.play();
}

// Menu
function menu() {
	music.pause();
	paused = !paused;
	if (paused == true) {
		document.getElementById('field_2').style.display='block';
	}
	draw();
}

// Resume
function resume() {
	paused = !paused;
	document.getElementById('field_2').style.display='none';
	draw();
}

// New game
function restart() {
	location.reload()
}

// Success
function success() {
	kill = 0;
	document.getElementById('field_0').style.display='none';
	document.getElementById('field_3').style.display='block';
	music.pause();
	yay.play();
}

// Level counter
function lvlcount() {
	switch (token) {
		case 1:
		lvl.value = 'Neg Form 1';
		break;
		case 2:
		lvl.value = 'Minor';
		break;
		case 3:
		lvl.value = 'Major';
		break;
		case 4:
		lvl.value = '6K';
		break;
		case 5:
		lvl.value = 'Separated';
		break;
		default:
		lvl.value = 'Model Mid';
		break;
	}
	loop;
}

// Fullscreen mode
function full() {
	canvas.requestFullscreen();
}

// Main script
const loop = function () {
	
	if (frameCount == 1) {
		if (paused == false) {
			music.play();
		} else {
			music.pause();
		}
	}
	if (frameCount == 9) {
		success();
	}
	
	switch (frameCount) {
		case 1:
		bg = document.getElementById("bg1");
		loc.value = "The Rotunda";
		break;
		case 2:
		bg = document.getElementById("bg2");
		loc.value = "T-court";
		break;
		case 3:
		bg = document.getElementById("bg3");
		loc.value = "Stribling";
		break;	
		case 4:
		bg = document.getElementById("bg4");
		loc.value = "Chapel";
		break;
		case 5:
		bg = document.getElementById("bg5");
		loc.value = "Mahan";
		break;
		case 6:
		bg = document.getElementById("bg6");
		loc.value = "Hopper";
		break;
		case 7:
		bg = document.getElementById("bg7");
		loc.value = "Alumni";
		break;
		default:
		bg = document.getElementById("bg8");
		loc.value = "Hospital Point";
		break;
	}

	if (controller.up && square.jumping == false) {
		square.yVelocity -= 30;
		boing.play();
		square.jumping = true;
	}
  
	square.xVelocity = (4 + (frameCount/2))*kill;
	square.yVelocity += 1.5;
	
	square.x += square.xVelocity;
	square.y += square.yVelocity;
	
	square.xVelocity *= 0.9;
	square.yVelocity *= 0.9;
	
	notsquare.x += notsquare.xVelocity;
  
	// Collision
	/* for (let j=0; j < obXCoors.length; j++) {
		obCol[j] = Math.abs(obXCoors[j] - square.x);
		
		if (obCol[j] < 10 && square.jumping == false) {
			oof.play();
			oof.volume = 1.0;
			square.x = -20;
			square.y -= 586 - 16 - 32;
			demerits += 50;
			token += 1;
			dcount.value = parseInt(dcount.value) + 10*token;
			lvlcount();
			if (parseInt(dcount.value) > 100) {
				over();
			} else {
				document.getElementById('field_0').style.display='block' ;
				setTimeout(function(){
					document.getElementById('field_0').style.display='none' ;}, 1000);
			}
		}
	};*/
	
	// Collision
	obCol = Math.abs(notsquare.x - square.x);
	
	if (obCol < 10 && square.jumping == false) {
		oof.play();
		oof.volume = 1.0;
		square.x = -20;
		square.y -= 586 - 16 - 32;
		demerits += 50;
		token += 1;
		dcount.value = parseInt(dcount.value) + 10*token;
		lvlcount();
		if (parseInt(dcount.value) > 100) {
			over();
		} else {
			document.getElementById('field_0').style.display='block' ;
			setTimeout(function(){
				document.getElementById('field_0').style.display='none' ;}, 1000);
		}
	}

	// Solid floor
	if (square.y > 586 - 16 - 125) {
		square.jumping = false;
		square.y = 586 - 16 - 125;
		square.yVelocity = 0;
	}

	// Continuous screen
	if (square.x < -20) {
		square.x = 1400;
	} else if (square.x > 1400) {
		square.x = -20;
		nextFrame();
	}
	
	// Obstacle roaming
	if (notsquare.x < -20) {
		notsquare.xVelocity *= -1;
	} else if (notsquare.x > 1400) {
		notsquare.xVelocity *= -1;
	}
  
	// Frame backgd
	context.drawImage(bg, 0, 0, 1400, 600); // x, y, width, height

	// Player element
	context.beginPath();
	context.drawImage(pic, square.x, square.y, square.width, square.height);
	context.fill();

	// Obstacle generator
	context.beginPath();
	context.drawImage(pic2, notsquare.x, notsquare.y, notsquare.width, notsquare.height);
	context.fill();

	// Ground element
	context.strokeStyle = "#000000";
	context.lineWidth = 30;
	context.beginPath();
	context.moveTo(0, 585);
	context.lineTo(1400, 585);
	context.stroke();
	draw();
}

// Drawer
function draw() {
	if (paused == false) {
		document.getElementById('field_2').style.display='none';
		window.requestAnimationFrame(loop);
	}
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);

// All credits to William Andriamihaja, with a little help from StackOverflow.com
