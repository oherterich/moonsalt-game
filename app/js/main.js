console.log("I'm working.");

require('jquery');
var Matter = require('matter-js');
var PIXI = require('pixi.js');

var w = 800;
var h = 600;


// Matter.js module aliases
var Engine = Matter.Engine;
var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;
var Composites = Matter.Composites;
var MouseConstraint = Matter.MouseConstraint;

// Create engine
var engine = Engine.create(document.body, {
	render: {
		options: {
			showAngleIndicator: true,
			wireframes: false
		}
	}
});
engine.world.gravity.y = 0;

// add a mouse controlled constraint
var mouseConstraint = MouseConstraint.create(engine);
World.add(engine.world, mouseConstraint);

// Create two boxes and a ground
var circleA = Bodies.trapezoid(400, 200, 20, 35, -0.5, { density: 0.01 });
circleA.restitution = 0.6;

// add all of the bodies to the world
World.add(engine.world, [circleA]);


function createBounds() {
	var top = Bodies.rectangle(w/2, 0, 810, 60, { isStatic: true });	
	var right = Bodies.rectangle(800, h/2, 60, 610, { isStatic: true });	
	var bottom = Bodies.rectangle(w/2, 600, 810, 60, { isStatic: true });	
	var left = Bodies.rectangle(0, h/2, 60, 610, { isStatic: true });
	World.add(engine.world, [top, right, bottom, left]);	
}
createBounds();

// Add a bunch of boxes
// var bunchOfBoxes = [];
// for ( var i = 0; i < 25; i++ ) {
// 	var box = Bodies.rectangle(20 * i, 50, 10, 10);
// 	bunchOfBoxes.push(box);
// }
// World.add(engine.world, bunchOfBoxes);

// Body.applyGravityAll(bunchOfBoxes, {x: 0, y: 0});


// run the engine
Engine.run(engine);



// Event Stuff

document.body.addEventListener('keydown', function (evt) {
	var f;

	switch (evt.keyCode) {
		case 87: // w
			f = { x: Math.cos(circleA.angle+Math.PI/2)/50, y: Math.sin(circleA.angle+Math.PI/2)/50 };
			Body.applyForce(circleA, circleA.position, f);
			break;

		case 65: // a
			circleA.angle -= 0.05;
			break;

		case 83: // s
			f = { x: Math.cos(circleA.angle-Math.PI/2)/50, y: Math.sin(circleA.angle-Math.PI/2)/50 };
			Body.applyForce(circleA, circleA.position, f);
			circleA.force = f;
			break;
		
		case 68: // d
			circleA.angle += 0.05;
			break;
	}
});

var socket = io.connect('http://localhost:8080');
socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});



var animate = function () {
	window.requestAnimationFrame(animate);

	socket.emit('playerPosition', circleA.position);
};

animate();




// // Create new instance of pixi stage
// var stage = new PIXI.Stage(0x66FF99);

// // Create a renderer instance
// var renderer = new PIXI.WebGLRenderer(w, h);//autoDetectRenderer(w, h);

// // add renderer to the DOM
// document.body.appendChild(renderer.view);

// requestAnimationFrame( animate );

// // create a texture from an image path
// var texture = PIXI.Texture.fromImage("/img/cage.jpg");

// // create a sprite  using texture
// var cage = new PIXI.Sprite(texture);

// // center the sprites anchor point
// cage.anchor.x = 0.5;
// cage.anchor.y = 0.5;

// // move sprite to the center
// cage.position.x = w/2;
// cage.position.y = h/2;

// stage.addChild(cage);

// function animate() {
// 	requestAnimationFrame( animate );

// 	// rotate sprite
// 	cage.rotation += 0.1;

// 	// render the stage
// 	renderer.render( stage );
// }

