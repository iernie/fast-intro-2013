var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 10000;

var clock;

var camera, scene, renderer;
var pointLight, geishaObj;

var map = [
	"         bbb         ",
	"                     ",
	"                     ",
	" bbb             bbb ",
	"                     ",
	"                     ",
	" bbbbbbbbbbbbbbbbbbb ",
]



materials = {
	'x': new THREE.MeshLambertMaterial({color: 0x632c1c}),
	'=': new THREE.MeshLambertMaterial({color: 0xde8342}),
	'-': new THREE.MeshLambertMaterial({color: 0xf5e0c4}),
	'|': new THREE.MeshLambertMaterial({color: 0xc10b0d}),
	'@': new THREE.MeshLambertMaterial({color: 0x3a6fa4}),
	'#': new THREE.MeshLambertMaterial({color: 0x4e76a4}),
	'b': new THREE.MeshLambertMaterial({color: 0xE8DC44}),
	'g': new THREE.MeshLambertMaterial({
	  color     : 0xcccccc,
	  shininess : 200,
	  shading   : THREE.SmoothShading,
	}),
}

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

	//
	// Goat
	//
	var counter = 0;

	for (var y = 0; y < goat.length; y++) {
		for (var x = 0; x < goat[y].length; x++) {
			if (goat[y][x] in materials) {
				var geometry = new THREE.CubeGeometry(1, 1, 1);
				var mesh = new THREE.Mesh(geometry, materials[goat[y][x]]);
				mesh.targetPosition = new THREE.Vector3(x, -y, 0);
				mesh.timeout = counter++ * 0.05 + Math.random() * 0.2;
				mesh.speed = 0.3;
				mesh.position.x = x;
				mesh.position.y = 80;
				scene.add(mesh);
			}
		}
	}

	//
	// Geisha
	//
	var counter = 0;
	geishaObj = [];

	for (var y = 0; y < geisha.length; y++) {
		for (var x = 0; x < geisha[y].length; x++) {
			if (geisha[y][x] in materials) {
				var geometry = new THREE.CubeGeometry(1, 1, 1);
				var mesh = new THREE.Mesh(geometry, materials[geisha[y][x]]);
				mesh.targetPosition = new THREE.Vector3(x-100, -y, 0);
				mesh.timeout = 10 + counter++ * 0.010 + Math.random() * 0.2;
				mesh.speed = 1;
				mesh.position.x = x-100;
				mesh.position.y = 80;
				scene.add(mesh);
				geishaObj.push(mesh);
			}
		}
	}

	//
	// Map
	//
	for (var y = 0; y < map.length; y++) {
		for (var x = 0; x < map[y].length; x++) {
			if (map[y][x] in materials) {
				var geometry = new THREE.CubeGeometry(10, 10, 10);
				var mesh = new THREE.Mesh(geometry, materials[map[y][x]]);
				mesh.position.x = x*10-170;
				mesh.position.y = -y*10+12;
				scene.add(mesh);
			}
		}
	}

	pointLight = new THREE.PointLight( 0xFFFFFF );
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	scene.add(pointLight);

	var backLight = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
	backLight.position.x = 10;
	backLight.position.y = 50;
	backLight.position.z = -130;
	scene.add(backLight);

	scene.add(sky.buildMesh());

	clock.start();
}

function animate() {

	requestAnimationFrame(animate);
	var time = clock.getElapsedTime();

	for (var i = 0; i < scene.children.length; i++) {
		var child = scene.children[i];

		if (child.timeout !== undefined && child.timeout > time) {
			continue;
		}

		if (child.targetPosition) {
			if (child.targetPosition.y < child.position.y) {
				child.position.y -= child.speed;
			}
			else {
				child.position = child.targetPosition;
				child.targetPosition = null;
			}
		}
	}

	var goatPosition = new THREE.Vector3(0, 0, 0);

	if ( time < 11 ) {
		camera.position.y = 20*Math.sin(time);
		camera.position.x = 50*Math.cos(time);
		camera.position.z = 50*Math.sin(time);
		camera.lookAt(new THREE.Vector3(Math.sin(time)*10, 0, 0));
	}
	else if ( time < 28 ) {
		camera.position.y = 20*Math.sin(time)+20;
		camera.position.x = 50*Math.cos(time)-100;
		camera.position.z = 50*Math.sin(time);
		camera.lookAt(new THREE.Vector3(Math.sin(time)*10-80, -20, 0));	
	}

	else if ( time < 30 ) {
		camera.position.y = -20;
		camera.position.x = -70;
		camera.position.z = 170;
		camera.lookAt(new THREE.Vector3(-70, -20, 0));	
	}
	else if ( time < 31 ) {
		$('#countdown3').show();
	}
	else if ( time < 32 ) {
		$('#countdown3').hide();
		$('#countdown2').show();
	}
	else if ( time < 33 ) {
		$('#countdown2').hide();
		$('#countdown1').show();
	}
	else if ( time < 34 ) {
		$('#countdown1').hide();
		$('#fight').show();
	}
	else if ( time < 38 ) {
		$('#fight').hide();
	}
	else if ( time < 43 ) {
		for (var i = 0; i < geishaObj.length; i++) {
			geishaObj[i].position.x += 0.3;
		}
	}
	else if ( time < 60 ) {
		for (var i = 0; i < geishaObj.length; i++) {
			var obj = geishaObj[i];
			var len = obj.position.distanceTo(goatPosition);

			if ( !obj.vec && len < time-60) {
				obj.vec = new THREE.Vector3(Math.random(), Math.random(), Math.random());
			}
			if ( obj.vec ) {
				obj.position.add(obj.vec);
			}
		}
	}

	renderer.render(scene, camera);
}