var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 10000;

var clock;

var camera, scene, renderer;
var sphereMaterial, sphere, pointLight;

var goat = [
	"       xxxx            ",
	"     xxxx              ", 
	"    xxx                ", 
	"  xxxxxxx              ", 
	" xxxxxxxxx          xx ", 
	" xxxxxxxxxx        xx  ", 
	"  xx  xxxxxxxxxxxxxxx  ", 
	"   x   xxxxxxxxxxxxxx  ", 
	"        xxxxxxxxxxxxx  ", 
	"         xxxxxxxxxxxx  ", 
	"         xx        xx  ", 
	"         xx        xx  ", 
	"         xx        xx  ",
	"         xx        xx  ",
];

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
	camera.position.z = 50;
	scene.add(camera);

	material = new THREE.MeshLambertMaterial({
		color: 0xcccccc
	});

	wireframeMaterial = new THREE.MeshLambertMaterial({
		color: 0x000000,
		wireframe: true
	});

	var counter = 0;

	for (var y = 0; y < goat.length; y++) {
		for (var x = 0; x < goat[y].length; x++) {
			if (goat[y][x] == 'x') {
				var geometry = new THREE.CubeGeometry(1, 1, 1);
				var mesh = new THREE.Mesh(geometry, material);
				mesh.targetPosition = new THREE.Vector3(x, -y, 0);
				mesh.timeout = counter++ * 0.05 + Math.random() * 0.2;
				mesh.position.x = x;
				mesh.position.y = 100;
				scene.add(mesh);
			}
		}
	}

	pointLight = new THREE.PointLight( 0xFFFFFF );
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	scene.add(sky.buildMesh());

	scene.add(pointLight);
	clock.start();
}

function animate() {

	requestAnimationFrame(animate);

	for (var i = 0; i < scene.children.length; i++) {
		var child = scene.children[i];

		if (child.timeout !== undefined && child.timeout > clock.getElapsedTime()) {
			continue;
		}

		if (child.targetPosition) {
			if (child.targetPosition.y < child.position.y) {
				child.position.y -= 0.3;
			}
			else {
				child.position = child.targetPosition;
				child.targetPosition = null;
			}
		}
	}

	camera.position.y = 20*Math.sin(clock.getElapsedTime());
	camera.position.x = 50*Math.cos(clock.getElapsedTime());
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	renderer.render(scene, camera);
}