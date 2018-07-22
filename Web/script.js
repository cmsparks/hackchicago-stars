let focus = true;

let starsData = JSON.parse(starsJSON).data;
let scene, clock, camera, renderer, raycaster, pcBuffer;
let mouse = new THREE.Vector2();
let intersection = null;
let description = document.getElementById("description");
let infoBox = document.getElementById("detailPane");
let switchHRTime = 1;
let selector;
let starPositions;
let HRToggle = true;
let starTex = new THREE.TextureLoader().load('img/star.png')

let coords = []


console.log(bvToRGB(0.656))
init();
animate();
function init() {
	scene = new THREE.Scene();
	clock = new THREE.Clock();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
	controls = new THREE.FirstPersonControls( camera );
	controls.movementSpeed = 1000;
	controls.lookSpeed = .3;
	controls.lookVertical = true;

	pcBuffer = generatePointcloud( starsData );
	pcBuffer.scale.set( 5,5,5 );
	pcBuffer.position.set( 0,0,0 );
	pcBuffer.geometry.attributes.color.dynamic = true;
	pcBuffer.geometry.dynamic = true;
	scene.add( pcBuffer );

	renderer = new THREE.WebGLRenderer();
	//050510
	renderer.setClearColor(0x050510	, 1);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	let sphereGeometry = new THREE.SphereGeometry( 1, 50, 50 );
	let sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	selector = new THREE.Mesh( sphereGeometry, sphereMaterial );
	scene.add( selector );

	raycaster = new THREE.Raycaster();
	raycaster.params.Points.threshold = 2;

	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener('mousedown', onMouseClick, false);
	console.log(pcBuffer)
}

function animate() {
	if(focus){
		requestAnimationFrame( animate );
	}
	raycaster.setFromCamera( mouse, camera );

	let intersections = raycaster.intersectObject( pcBuffer );
	//console.log(intersections);
	intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

	if(intersection != null) {
		infoBox.style.left = (mouse.xpx-300)+"px";
		infoBox.style.top = (mouse.ypx)+"px";	
		description.style.left = (5+mouse.xpx)+"px";
		description.style.top = (mouse.ypx-25)+"px";
		description.innerHTML = starsData[intersection.index][6]+" ("+starsData[intersection.index][5]+")";
		selector.position.set(intersection.point.x,intersection.point.y,intersection.point.z)
		selector.position.set(starsData[intersection.index][1]*50,starsData[intersection.index][2]*50,starsData[intersection.index][3]*50)
	}
	else {
		description.innerHTML = "";
	}

	renderer.render( scene, camera );
	if(HRToggle) {
		controls.update( clock.getDelta() );
	}
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.xpx = event.clientX;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	mouse.ypx = event.clientY;
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onMouseClick() {
	if(intersection!=null){
		focus = false;
		console.log(starsData[intersection.index]);
		handleInfo(starsData[intersection.index]);
	}
}

function generateStarGeometry(data, isClustered, clusterDat) {
	let geometry = new THREE.BufferGeometry();

	let posArr = [];
	let colorArr = [];
	let sizeArr = [];
	let indexed = [];

	for(let i = 0; i < data.length; i++) {
		//if(isClustered) {
			
		//}
		//else {
		let rgb = bvToRGB(data[i][0])
		rgb[0] /= 255
		rgb[1] /= 255
		rgb[2] /= 255

		if(rgb[0]>1) {
			rgb[0] = 1;
		}
		else if(rgb[0]<0){
			rgb[0] = 0;
		}
		if(rgb[1]>1){
			rgb[1] = 1;
		}
		else if(rgb[1]<0){
			rgb[1] = 0;
		}
		if(rgb[2]>1){
			rgb[2] = 1
		}
		else if(rgb[2]<0) {
			rgb[2] = 0;
		}
		if(rgb[0]===0&&rgb[1]===0&&rgb[2]===0) {
			console.log(data[i])
		}
		colorArr.push(rgb[0],rgb[1],rgb[2]);
		//}
		e
		sizeArr.push((data[i][4]+17)/7);

		posArr.push(data[i][1],data[i][2],data[i][3])
		//indexed.push(i)
	}
	let positions = new Float32Array(posArr);
	let colors  = new Float32Array(colorArr);
	//let indicies = new Uint32Array(indexed);
	let sizes = new Float32Array(sizeArr);
	console.log("setstarpos")
	starPositions = new Float32Array(posArr);
	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('color', new THREE.BufferAttribute(colors,3));
	geometry.addAttribute('size', new THREE.BufferAttribute(sizes,1))
	//geometry.setIndex(new THREE.BufferAttribute(indicies, 1));
	//geometry.addGroup(0, indicies.length);

	return geometry;
}

function generatePointcloud(data) {
	let geometry = generateStarGeometry(data);
	let material = new THREE.PointsMaterial({ size: 7, vertexColors: THREE.VertexColors, map: starTex,transparent: true})
	material.alphaTest = 0.05;
	let pointcloud = new THREE.Points( geometry, material )

	return pointcloud;
}

function toggleHR() {
	if(HRToggle) {
		HRToggle = false;
		switchToHR();
		camera.position.x = 440;
		camera.position.y = 85;
		camera.position.z = 450;
		camera.rotation.x = 0;
		camera.rotation.y = 0;
		camera.rotation.z = 0;
	}
	else {
		HRToggle = true;
		switchFromHR();
	}
}

function switchFromHR() {
	pcBuffer.geometry.attributes.position.array = starPositions;
	//weird stuff with references so this is a workaround for my bad code
	for(let i = 0; starPositions.length > i; i++) {
		starPositions[i] = pcBuffer.geometry.attributes.position.array[i];
	}
	pcBuffer.geometry.attributes.position.needsUpdate = true;
	pcBuffer.scale.set( 20,20,20 );
	let material = new THREE.PointsMaterial({ size: 7, vertexColors: THREE.VertexColors, map: starTex, transparent: true })
	material.alphaTest = 0.05;
	pcBuffer.material = material;
}

function switchToHR() {
	//lerps values between the Hertzpeg Russel diagram and the regular cartesian thing.
	//if on init
	for(let i = 0; i < pcBuffer.geometry.attributes.position.array.length/3; i++) {
		//x
		if(starsData[i][0] != null) {
			pcBuffer.geometry.attributes.position.array[i*3] = starsData[i][0]*125  ///10,switchHRTime)
		}
		else{
			pcBuffer.geometry.attributes.position.array[i*3] = 1000
		}
		//y
		if(starsData[i][4] != null) {
			pcBuffer.geometry.attributes.position.array[(i*3)+1] = (255*Math.log(starsData[i][4]))/25///10,switchHRTime)
		}
		else{
			pcBuffer.geometry.attributes.position.array[(i*3)+1] = 1000
		}
		//z
		pcBuffer.geometry.attributes.position.array[(i*3)+2] = 0//lerp(coords[i*3]//,0,switchHRTime);
	}
	pcBuffer.geometry.attributes.position.needsUpdate = true;
	let material = new THREE.PointsMaterial({ size: 3, vertexColors: THREE.VertexColors})
	pcBuffer.material = material;
	pcBuffer.scale.set(2,2,2)
}

