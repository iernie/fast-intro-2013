var VIEW_ANGLE = 45,
	ASPECT = screen.width / screen.height,
	NEAR = 0.1,
	FAR = 10000;

var clock;

var camera, scene, renderer;
var pointLight, geishaObj;

var introSong, wubWubSong, screamingGoat;

var map = [
	"         bbb         ",
	"                     ",
	"                     ",
	" bbb             bbb ",
	"                     ",
	"                     ",
	" bbbbbbbbbbbbbbbbbbb ",
]

initSound();

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

$('#start').on('click', function () {
	$(this).hide();
	init();
	animate();
});
	
$(window).on('resize', function () {
	camera.aspect = screen.width / screen.height;
	camera.updateProjectionMatrix();
	renderer.setSize( screen.width, screen.height );
});

function initSound() {
	wubWubSong = document.createElement('audio');
	wubWubSong.setAttribute('src', 'wubwub.ogg');
	wubWubSong.addEventListener("loadeddata", function() {
		$('#start').show();
		$('#loading').hide();
	}, true);

	screamingGoat = document.createElement('audio');
	screamingGoat.setAttribute('src', 'screaming_goat.ogg');
	screamingGoat.load();
	screamingGoat.addEventListener("loadeddata", function() {
		wubWubSong.load();
	}, true);

	introSong = document.createElement('audio');
	introSong.setAttribute('src', 'intro.ogg');
	introSong.load();
	introSong.addEventListener("loadeddata", function() {
		screamingGoat.load();
	}, true);
}

function init() {

	browser.requestFullscreen();
	
	clock = new THREE.Clock();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(screen.width, screen.height);

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
	introSong.play();
}

function animate() {

	requestAnimationFrame(animate);
	
	var delta = clock.getDelta();
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
		camera.position.y = 20*Math.sin(time)+40;
		camera.position.x = 50*Math.cos(time)+40;
		camera.position.z = 50*Math.sin(time);
		camera.lookAt(new THREE.Vector3(Math.sin(time)*10, 0, 0));
	}
	else if ( time < 29 ) {
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
	else if ( time < 35 ) {
		$('#fight').hide();
	}
	else if ( time < 40 ) {
		for (var i = 0; i < geishaObj.length; i++) {
			geishaObj[i].position.x += 10 * delta;
		}
	} else if (time < 44) {
		screamingGoat.play();
	}
	else if ( time < 120 ) {
		wubWubSong.play();
		for (var i = 0; i < geishaObj.length; i++) {
			var obj = geishaObj[i];
			var len = obj.position.distanceTo(goatPosition);

			if ( !obj.vec && len < time*1.5-40) {
				obj.vec = new THREE.Vector3(Math.random()*-0.6, (Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3);
			}
			if ( obj.vec ) {
				obj.position.add(obj.vec);
			}

		}
	}

	if ( time > 40 && time < 42 ) {
		camera.position.y = 5;
		camera.position.x = -10;
		camera.position.z = 20;
		camera.lookAt(new THREE.Vector3(5, -5, 0));
	}

	if ( time > 42 && time < 44 ) {
		camera.position.y = 5;
		camera.position.x = -5;
		camera.position.z = 15;
		camera.lookAt(new THREE.Vector3(5, -5, 0));
	}

	if ( time > 44 ) {
		camera.position.y = 20*Math.sin(time/4+Math.PI)+10;
		camera.position.x = 50*Math.cos(time/4+Math.PI)+20;
		camera.position.z = 50*Math.sin(time/4+Math.PI);
		camera.lookAt(new THREE.Vector3(Math.sin(time)*10-40, -20, 0));
	}

	if ( time > 60 ) {
		$('#roguebyte').show();
	}

	if ( time < 120 ) {
		renderer.render(scene, camera);
	}
}