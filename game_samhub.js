const context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 400;
context.canvas.width = 1220;

let frameCount = 1;
let obCount = frameCount;

const obXCoors = [];
var obCol = [];
var demerits = 0;
let token = 0;
var cheat = localStorage["key"];
let kill = 1;
let killy = 1;
let safety = 1;
var paused = false;
var dcount = document.getElementById("dem");
dcount.value = 0;
var lvl = document.getElementById("off");
lvl.value = "Model Mid";
var loc = document.getElementById("loc");
loc.value = "Rotunda";
var pic=document.getElementById("pic");
var pic2=document.getElementById("danger");
var bg=document.getElementById("bg1");
var music = document.getElementById("myAudio");
var sound = document.getElementById("yourAudio");
var oof = document.getElementById("hisAudio");
var boing = document.getElementById("herAudio");
var yay = document.getElementById("itsAudio");

function playAudio() {
	music.play();
}

function pauseAudio() {
	music.pause();
}

const square = {

  height: 100,
  jumping: true,
  width: 100,
  x: 0,
  xVelocity: 0.5,
  y: 0,
  yVelocity: 0
};

// Obstacles
const nextFrame = () => {
	frameCount++;
  
  for (let i = 0; i < obCount; i++) {
    obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
    obXCoors.push(obXCoor);
  }

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
		break
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

// Pause
function menu() {
	pauseAudio();
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
		loc.value = "Rotunda";
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

    square.yVelocity -= 30*safety;
	boing.play();
    square.jumping = true;

  }
  
  if (cheat == 0) {
	  square.xVelocity = (4 + (frameCount/2))*kill;	
  } else {
	  square.xVelocity = 100;
  }	  
  
  square.yVelocity += 1.5*killy;
  square.x += square.xVelocity;
  square.y += square.yVelocity;
  square.xVelocity *= 0.9;
  square.yVelocity *= 0.9;
  
  // Collision
  for (let j=0; j < obXCoors.length; j++) {
	  obCol[j] = Math.abs(obXCoors[j] - square.x);
		if (obCol[j] < 10 && square.jumping == false) {
			oof.play();
			oof.volume = 1.0;
			square.x = -20;
			square.y -= 386 - 16 - 32;
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
	};

  // Solid floor
  if (square.y > 386 - 16 - 100) {

    square.jumping = false;
    square.y = 386 - 16 - 100;
    square.yVelocity = 0;

  }

  // Continuous screen
  if (square.x < -20) {

    square.x = 1220;

  } else if (square.x > 1220) {

    square.x = -20;
    nextFrame();

  }
  
  // Frame backgd
  context.drawImage(bg, 0, 0, 1220, 400); // x, y, width, height


  // Player element
  context.beginPath();
  context.drawImage(pic, square.x, square.y, square.width, square.height);
  context.fill();


  // Obstacle generator
  const height = 100;
  const width = 100;

  obXCoors.forEach((obXCoor) => {
    context.beginPath();

    context.drawImage(pic2, obXCoor, 386 - 16 - 100, width, height); 
  
    context.closePath();
    context.fill();
  })

  // Ground element
  context.strokeStyle = "#2E2532";
  context.lineWidth = 30;
  context.beginPath();
  context.moveTo(0, 385);
  context.lineTo(1220, 385);
  context.stroke();
  draw();

  // Drawer
};
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
