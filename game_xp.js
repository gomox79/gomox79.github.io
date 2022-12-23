// Constants
const height = 600;
const width = 1400;
const squareDim = 125;

// Canvas element
const canvas = document.getElementById('canvas');
const context = document.querySelector('canvas').getContext('2d');
context.canvas.height = height;
context.canvas.width = width;

// Main script variables
let demerits = 0;
let lvlToken = 0;
let killCoeff = 1;
let paused = false;

// HTML elements
let dcount = document.getElementById('dem');
let lvl = document.getElementById('off');
let loc = document.getElementById('loc');
let bg = document.getElementById('bg1');
let img1 = document.getElementById('pic'); // Player
let img2 = document.getElementById('danger'); // Dynamic obstacle
let img3 = document.getElementById('vodka'); // Static obstacle

const bgMus = document.getElementById('myAudio'); // Background music
const succMus = document.getElementById('itsAudio'); // Success music
const failMus = document.getElementById('yourAudio'); // Failure music
const jmpSound = document.getElementById('herAudio'); // Jump sound
const colSound = document.getElementById('hisAudio'); // Collision sound

// Player element
const player = {
	height: squareDim,
	width: squareDim,
	x: 0,
	y: 0,
	Vx: 1,
	Vy: 0,
	jumping: false
};

// Dynamic obstacle element
const opponent = {
	height: squareDim,
	width: squareDim,
	x: 1390,
	y: 586 - 16 - 125,
	Vx: -1
};

// Initial conditions
let frameCount = 1;
let obCount = frameCount;
let statXCoors = [];
dcount.value = 0;
lvl.value = 'English';
loc.value = 'ACME';

// Static obstacles generation
const nextFrame = () => {
	frameCount ++;
	
	for (let i = 0; i < obCount; i ++) {
		statXCoor = Math.floor(Math.random()*(1165 - 140 + 1) + 140);
		statXCoors.push(statXCoor);
	}
};

// Player control
const controller = {
	left: false,
	right: false,
	up: false,
	esc: false,
	keyListener: function(event) {
		let keyState = (event.type == 'keydown')? true : false;
		
		switch (event.keyCode) {
			case 38: controller.up = keyState;
			break;
			case 27: controller.esc = keyState;
			break;
			default: break;
		}
	}
};

// Chronometer functions
let secLabel = document.getElementById('seconds');
let minLabel = document.getElementById('minutes');
let timeCount = 0;
if (killCoeff && !paused) setInterval(setTime, 1000); // Calls setTime() each second

function setTime() {
	++ timeCount;
	secLabel.innerHTML = pad(timeCount % 60);
	minLabel.innerHTML = pad(timeCount / 60);
}

function pad(timeVal) {
	let timeString = timeVal + '';
	
	if (timeString.length < 2) return '0' + timeString;
	else return timeString;
}

// Collision function
function collide() {
	colSound.play();
	player.x = -20;
	player.y = 586 - 16 - 32;
	demerits += 50;
	lvlToken ++;
	dcount.value = parseInt(dcount.value) + 10*lvlToken;
	
	switch (lvlToken) {
		case 1: lvl.value = 'Sloppy';
		break;
		case 2: lvl.value = 'Irish';
		break;
		case 3: lvl.value = 'Spanish';
		break;
		case 4: lvl.value = 'Polish';
		break;
		case 5: 
			lvl.value = 'Gibberish';
			fail();
		break;
		default: lvl.value = 'Model Mid';
		break;
	}
	
	document.getElementById('field_0').style.display = 'block';
	setTimeout(function() {document.getElementById('field_0').style.display = 'none';}, 1000);
	loop();
}

// Success function
function success() {
	killCoeff = 0;
	document.getElementById('field_0').style.display = 'none';
	document.getElementById('field_3').style.display = 'block';
	bgMus.pause();
	succMus.play();
}

// Failure function
function fail() {
	killCoeff = 0;
	document.getElementById('field_0').style.display = 'none';
	document.getElementById('field_1').style.display = 'block';
	bgMus.pause();
	failMus.play();
}

// Pause functions
function menu() {
	bgMus.pause();
	document.getElementById('field_2').style.display = 'block';
	paused = !paused;
	draw();
}

function resume() {
	bgMus.play();
	document.getElementById('field_2').style.display = 'none';
	paused = !paused;
	draw();
}

// Reload function
function restart() location.reload();

// Drawer function
function draw() {
	if (!paused) {
		document.getElementById('field_2').style.display = 'none';
		window.requestAnimationFrame(loop);
	}
}

// Main script
const loop = function() {
	// Event checks
	if (controller.esc) {
		if (paused) resume();
		else if (!paused) menu();
	}
	
	if (controller.up && !player.jumping) {
		player.Vy -= 30;
		player.jumping = !player.jumping;
		jmpSound.play();
		setTimeout(function() {player.jumping = !player.jumping;}, 500);
	}
	
	// Frame check
	switch (frameCount) {
		case 1:
			bg = document.getElementById('bg1');
			loc.value = 'ACME';
		break;
		case 2:
			bg = document.getElementById('bg2');
			loc.value = 'Fed House';
		break;
		case 3:
			bg = document.getElementById('bg3');
			loc.value = 'Dillo\'s';
		break;
		case 4:
			bg = document.getElementById('bg4');
			loc.value = 'Gate 1';
		break;
		case 5:
			bg = document.getElementById('bg5');
			loc.value = 'Red Beach';
		break;
		case 6:
			bg = document.getElementById('bg6');
			loc.value = '4-0';
		break;
		case 7:
			bg = document.getElementById('bg7');
			loc.value = '4-4 P-Way';
		break;
		case 8:
			bg = document.getElementById('bg8');
			loc.value = 'Wardroom';
		break;
		default: success();
		break;
	}
	
	// Element Kinematics
	player.Vx = killCoeff*(4 + (frameCount/2));
	player.Vy += 1.5; // *** ??? ***
	player.x += player.Vx;
	player.y += player.Vy;
	
	opponent.Vx = killCoeff*(5 + lvlToken);
	if (opponent.x < -20 || opponent.x > 1390) opponent.Vx *= -1;
	opponent.x += opponent.Vx;
	
	// Frame Physics
	if (player.x < -20) player.x = 1400;
	else if (player.x > 1400) {
		player.x = -20;
		nextFrame();
	}
	
	if (player.y > 586 - 16 - 125) {
		player.y = 586 - 16 - 125;
		player.Vy = 0;
	}
	
	// Static Collision
	for (let i = 0; i < statXCoors.length; i ++) {
		if (player.x < statXCoors[i] + squareDim &&
		player.x + player.width > statXCoors[i] &&
		player.y < 445 + squareDim &&
		player.height + player.y > 445) collide();
	}
	
	// Dynamic Collision
	if (player.x < opponent.x + opponent.width &&
    player.x + player.width > opponent.x &&
    player.y < opponent.y + opponent.height &&
    player.height + player.y > opponent.y) collide();
	
	// Frame Drawing
	context.drawImage(bg, 0, 0, width, height);
	
	// Ground Drawing
	context.strokeStyle = '#000000';
	context.lineWidth = 30;
	context.beginPath();
	context.moveTo(0, 585);
	context.lineTo(1400, 585);
	context.stroke();
	
	// Player Drawing
	context.beginPath();
	context.drawImage(img1, player.x, player.y, player.width, player.height);
	context.fill();
	
	// Dynamic Obstacle Drawing
	context.beginPath();
	context.drawImage(img2, opponent.x, opponent.y, opponent.width, opponent.height);
	context.fill();
	
	// Static Obstacles Drawing
	statXCoors.forEach((statXCoor) => {
		context.beginPath();
		context.drawImage(img3, statXCoor, 586 - 16 - 125, 125, 125);
		context.closePath();
		context.fill();
	})
	
	draw();
}

window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);
window.requestAnimationFrame(loop);

// Program coded by William Andriamihaja
