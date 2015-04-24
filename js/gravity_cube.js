/*================================
	GRAVITY CUBE HOST
================================*/

/* CONSTANTS */
var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight,
	ASPECT = WIDTH / HEIGHT;

var MAX_CUBES = 100,
	CUBE_SIZE = 10;

/* GLOBALS */
var clock, debug;
var cubes, players;

/* THREE.JS GLOBALS */
var t = THREE;
var scene, projector, camera, renderer,
	composer, RGBShader;

function init () {

	clock = new t.Clock();

	/* Create debugger */
	debug = document.createElement( "debug" );
	debug.style.position = "absolute";
	debug.style.top = "0px";
	debug.style.right = "0px";
	debug.style.width = "35%";
	debug.style.textAlign = "center";
	debug.style.color = "#000000";
	debug.innerHTML = "TO DO: Make game.";
	document.body.appendChild( debug );

	scene = new t.Scene();
	projector = new t.Projector();

	camera = new t.PerspectiveCamera( 30, ASPECT, 0.1, 10000 );
	// CAMERA POSITION / LOOKAT

	renderer = new t.WebGLRenderer( { antialias: true } );
	renderer.setSize( WIDTH, HEIGHT );
	document.body.appendChild( renderer.domElement );

	composer = new t.EffectComposer( renderer );
	composer.addPass( new t.RenderPass( scene, camera ));

	RGBShader = new t.ShaderPass( t.RGBShiftShader );
	RGBShader.uniforms[ "amount" ].value = 0.001;

	composer.addPass( RGBShader );

	window.addEventListener( "resize", onResize, false );
	window.addEventListener( "keypress", onKeyPress, false );

	renderer.setClearColor( 0x202020, 1 );

	setup();

}

function setup () {

}

function render () {

	composer.render();

}

function animate () {

	requestAnimationFrame( animate );
	update();
	render();

}

init();
animate();

/*=======================================================
	MISC FUNCTIONS
=======================================================*/

function calcDistance ( x1, y1, x2, y2 ) {

	return Math.sqrt( ( x1 - x2 ) * ( x1 - x2 ) + ( y1 - y2 ) * ( y1 - y2 ) );

}