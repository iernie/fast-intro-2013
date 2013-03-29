var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 10000;

var clock;

var camera, scene, renderer;
var sphereMaterial, sphere, pointLight;

init();
animate();

function init() {
	clock = new THREE.Clock();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);

	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(
		VIEW_ANGLE, ASPECT, NEAR, FAR );

	scene = new THREE.Scene();
	camera.position.z = 300;
	scene.add(camera);

	sphereMaterial = new THREE.MeshLambertMaterial({
		color: 0xff1100
	});

	sphere = new THREE.Mesh(
		new THREE.SphereGeometry(
			50, 16, 16),
		sphereMaterial);

	scene.add(sphere);

	pointLight = new THREE.PointLight( 0xFFFFFF );
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	scene.add(pointLight);
	clock.start();
}

function animate() {

	//console.log(clock.getElapsedTime());

	requestAnimationFrame(animate);

	sphere.rotation.x += 0.01;
	sphere.rotation.y += 0.02;
	sphere.position.x = 100*Math.sin(clock.getElapsedTime());
	sphere.position.y = 50*Math.sin(clock.getElapsedTime());

	renderer.render(scene, camera);
}