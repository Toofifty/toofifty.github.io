THREE = require('three')
THREE.MaskPass = require('./MaskPass')
THREE.Projector = require('./Projector')
THREE.EffectComposer = require('./EffectComposer')
THREE.ShaderPass = require('./ShaderPass')
THREE.RenderPass = require('./RenderPass')

var POINTS = { x: 6, y: 6 }
var MOUSE_AOE = 100

var CLEAR_COLOR = 0x0172FF
var MAIN_COLOR  = 0x0f88f2
// var MAIN_COLOR  = 0xFFFFFF

var WIDTH  = window.innerWidth
var HEIGHT = window.innerHeight
var ASPECT = WIDTH / HEIGHT

var clock, scene,
	  camera, projector,
	  renderer, composer

var plane, hitplane
var m3d = {x: -10, y: -10, z: -100}
var mouse = {x: -10, y: -10}

function dist(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt(
		(x1 - x2) * (x1 - x2) +
		(y1 - y2) * (y1 - y2) +
		(z1 - z2) * (z1 - z2)
	)
}

function initThreeJS() {
	scene = new THREE.Scene()
	projector = new THREE.Projector()

	camera = new THREE.PerspectiveCamera(30, ASPECT, 0.1, 10000)
	camera.position.set(-243, 600, 182)
	camera.lookAt(new THREE.Vector3(0, 0, 0))

	renderer = new THREE.WebGLRenderer({antialias: true})
	renderer.setSize(WIDTH, HEIGHT)
	renderer.setClearColor(CLEAR_COLOR)
	document.body.appendChild(renderer.domElement);
}

function initShaders() {
	composer = new THREE.EffectComposer(renderer)
	composer.addPass(new THREE.RenderPass(scene, camera))
	var copyShader = new THREE.ShaderPass(THREE.CopyShader)
	copyShader.renderToScreen = true
	composer.addPass(copyShader)
}

function initScene() {
	var geometry = new THREE.PlaneGeometry(300, 300, POINTS.x, POINTS.y)
	var light = new THREE.DirectionalLight(MAIN_COLOR, 0.7)
	var hemi = new THREE.HemisphereLight(MAIN_COLOR, MAIN_COLOR, 1)

	plane = new THREE.Mesh(
		geometry,
		new THREE.MeshLambertMaterial(
			{color: MAIN_COLOR, shading: THREE.FlatShading}
		)
	)

	hitplane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(1000, 1000, 1, 1),
		new THREE.MeshBasicMaterial(
			{transparent: true, opacity: 0}
		)
	)

	plane.rotation.x = -Math.PI / 2
	plane.geometry.dynamic = true
	hitplane.rotation.x = -Math.PI / 2

	var u = plane.geometry.vertices;
	var d = Math.abs(u[0].x - u[1].x)

	for (var i = 0; i < u.length; i++) {
		u[i].x += (Math.random() - 0.5) * d * 0.5
		u[i].y += (Math.random() - 0.5) * d * 0.5
	}

	plane.geometry.computeFaceNormals()
	plane.geometry.normalsNeedUpdate = true
	plane.geometry.verticesNeedUpdate = true

	light.position.set(500, 1000, 500)
	hemi.position.set(0, 500, 0)

  scene.add(plane)
  scene.add(hitplane)
  scene.add(light)
  scene.add(hemi)
}

function onResize(event) {
	WIDTH = window.innerWidth
	HEIGHT = window.innerHeight
	ASPECT = WIDTH / HEIGHT

	renderer.setSize(WIDTH, HEIGHT)
	composer.setSize(WIDTH, HEIGHT)

	camera.aspect = ASPECT
	camera.updateProjectionMatrix()
}

function onMouseMove(event) {
	mouse.x = event.clientX / WIDTH * 2 - 1
	mouse.y = event.clientY / -HEIGHT * 2 + 1
}

function update() {
  var u = plane.geometry.vertices;

  for (var i = 0; i < u.length; i++) {
    u[i].z = 0;
    var d = dist(u[i].x, u[i].y, 0, m3d.x, m3d.y, m3d.z)

    if (d < MOUSE_AOE) u[i].z -= (MOUSE_AOE - d) / 2
  }
  plane.geometry.computeFaceNormals()
  plane.geometry.normalsNeedUpdate = true
  plane.geometry.verticesNeedUpdate = true

  var vector = new THREE.Vector3(mouse.x, mouse.y, 1)
  projector.unprojectVector(vector, camera)
  var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
  var intersects = ray.intersectObjects(scene.children)

  for (var i = 0; i < intersects.length; i++) {
    if (intersects[i].object == hitplane) {
      m3d.x = intersects[i].point.x
      m3d.y = -intersects[i].point.z
      m3d.z = intersects[i].point.y
    }
  }
}

function init() {
	window.addEventListener('resize', onResize, false)
	window.addEventListener('mousemove', onMouseMove, false)

	initThreeJS()
	initShaders()
	initScene()
}

function anim() {
	requestAnimationFrame(anim)
	update()
	composer.render()
}

init()
anim()
