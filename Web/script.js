let focus = true;
let escapeFocus = true;
let isClustered = false;
let gameMode = false;
let mouseDown = false;
let secs = 0
let enemyList = [];

let starsData = JSON.parse(jsonshit).data;
let scene, clock, camera, renderer, raycaster, pcBuffer;
let mouse = new THREE.Vector2();
let intersection = null;
let description = document.getElementById("description");
let infoBox = document.getElementById("detailPane");
let switchHRTime = 1;
let selector;
let starPositions;
let HRToggle = true;
let element
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
	controls.movementSpeed = 10;
	controls.lookSpeed = .3;
	controls.lookVertical = true;

	pcBuffer = generatePointcloud( starsData );
	pcBuffer.scale.set( 50,50,50 );
	pcBuffer.position.set( 0,0,0 );
	pcBuffer.geometry.attributes.color.dynamic = true;
	pcBuffer.geometry.dynamic = true;
	scene.add( pcBuffer );
	

	renderer = new THREE.WebGLRenderer();
	//050510
	renderer.setClearColor(0x050510	, 1);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	//let element = renderer.domElement;

	let sphereGeometry = new THREE.SphereGeometry( 1, 50, 50 );
	let sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	selector = new THREE.Mesh( sphereGeometry, sphereMaterial );
	//scene.add( selector );

	raycaster = new THREE.Raycaster();
	raycaster.params.Points.threshold = 4;

	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener('mousedown', onMouseClick, false);
	window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "Escape":
	if(focus!=true) {closeInfo()}
	else {escapeMenu()}
	break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
	}, true);
	
	console.log(pcBuffer)
}

function escapeMenu() {
	if (escapeFocus) {
		showEscape();
	}
	else {
		hideEscape();
	}
}

function showEscape() {
	escapeFocus = false;
	document.getElementById('menupane').style.display = "block"
}

function hideEscape() {
	escapeFocus = true;
	document.getElementById('menupane').style.display = "none"
	animate()
}


function animate() {
	if(focus && escapeFocus){
		requestAnimationFrame( animate );
	}
	raycaster.setFromCamera( new THREE.Vector2( 0, 0 ), camera );
	
	secs = secs+1
	let sinSm = Math.sin(secs/20);
	let sinLg = Math.sin(secs/120)
	let intersections = raycaster.intersectObject( pcBuffer );
	//console.log(intersections);
	intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;
	if(mouseDown === false) {document.getElementById('imgshitafter').style.display = "none"}
	if(gameMode) {
		//handle shooting
		if(mouseDown) {
			for(let i = 0; i < enemyList.length; i++) {
				let shot = raycaster.intersectObject( enemyList[i], true );
				if(shot.length > 0){
					killEnemy(i)
				}
			}
		}
		for(let i = 0; i < enemyList.length; i++) {
				let coeff = 1
				if(i%2 === 0) {coeff=-1}
                                console.log(enemyList[i].position)
                                enemyList[i].position.set(enemyList[i].position.x+(coeff*sinSm), enemyList[i].position.y+(coeff*sinSm), enemyList[i].position.z+(coeff*sinLg) );
                        }
		//handle movement of enemies	

		//handle detection of player distance
	}

	if(intersection != null) {
		infoBox.style.left = (mouse.xpx-300)+"px";
		infoBox.style.top = (mouse.ypx)+"px";	
		description.style.left = "50%";
		description.style.top = "50%";
		description.innerHTML = starsData[intersection.index][6]+" ("+starsData[intersection.index][5]+")";
		selector.position.set(intersection.point.x,intersection.point.y,intersection.point.z)
		selector.position.set(starsData[intersection.index][1]*100,starsData[intersection.index][2]*100,starsData[intersection.index][3]*100)
	}
	else {
		description.innerHTML = "";
	}

	renderer.render( scene, camera );
	if(HRToggle) {
		controls.update( clock.getDelta() );
	}
	mouseDown = false;
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
	if(gameMode === false) {
		if(intersection!=null){
			focus = false;
			console.log(starsData[intersection.index]);
			handleInfo(starsData[intersection.index]);
		}
	}
	mouseDown = true;
	if(gameMode === true) {
		document.getElementById('imgshitafter').style.display = "block"
	}
}

function generateStarGeometry(data, isClustered, clusterDat) {
	let geometry = new THREE.BufferGeometry();

	let posArr = [];
	let colorArr = [];
	let sizeArr = [];
	let indexed = [];

	for(let i = 0; i < data.length; i++) {
		if(isClustered) {
			if(data[i][7]===0) {
				colorArr.push(255,0,0)
			}
			else if(data[i][7]===1) {
				colorArr.push(0,255,0)
                        }
			else if(data[i][7]===2) {
				colorArr.push(0,0,255)
                        }

			else if(data[i][7]===3) {
				colorArr.push(255,255,0)
                        }

			else if(data[i][7]===4) {
				colorArr.push(0,255,255)
                        }
                        else if(data[i][7]===5) {
                                colorArr.push(255,0,255)
                        }
                        else if(data[i][7]===6) {
                                colorArr.push(255,255,255)
                        }
                        else if(data[i][7]===7) {
                                colorArr.push(255,128,0)
                        }
                        else if(data[i][7]===8) {
                                colorArr.push(0,128,255)
                        }
                        else if(data[i][7]===9) {
                                colorArr.push(0,255,128)
                        }
                        else if(data[i][7]===10) {
                                colorArr.push(128,0,0)
                        }
                        else if(data[i][7]===11) {
                                colorArr.push(128,128,255)
                        }
			else {
				colorArr.push(255,128,255)
			}
		}
		else {
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
		}
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
	let geometry = generateStarGeometry(data, isClustered);
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
	pcBuffer.scale.set( 50,50,50 );
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
			pcBuffer.geometry.attributes.position.array[(i*3)+1] = 50-(255*Number(starsData[i][4]))/25///10,switchHRTime)
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


function toggleCluster() {
	if(isClustered === false) {
		enableClustering();
	}
	else {
		disableClustering();
	}
}

function enableClustering() {
	isClustered = true;
	pcBuffer = generatePointcloud( starsData );
        pcBuffer.scale.set( 50,50,50 );
        pcBuffer.position.set( 0,0,0 );
        pcBuffer.geometry.attributes.color.dynamic = true;
        pcBuffer.geometry.dynamic = true;
        scene.add( pcBuffer );
}

function disableClustering() {
	isClustered = false;
	pcBuffer = generatePointcloud( starsData );
        pcBuffer.scale.set( 50,50,50 );
        pcBuffer.position.set( 0,0,0 );
        pcBuffer.geometry.attributes.color.dynamic = true;
        pcBuffer.geometry.dynamic = true;
        scene.add( pcBuffer );
}

function addSaucer(x,y,z) {
	let group = new THREE.Group()  
	console.log('test');
	var geometry1 = new THREE.SphereGeometry( 5, 32, 32 );
	var material1 = new THREE.MeshBasicMaterial( {color: 0x888888} );
	var sphere1 = new THREE.Mesh( geometry1, material1 );
	sphere1.scale.set(2,.5,2)
	group.add( sphere1 );
	var geometry2 = new THREE.SphereGeometry( 5, 32, 32 );
	var material2 = new THREE.MeshBasicMaterial( {color: 0x6666ff} );
	var sphere2 = new THREE.Mesh( geometry2, material2 );
	sphere2.scale.set(.75,.70,.75)
	sphere2.position.set(0,1.25,0)
	group.add( sphere2 );
	group.position.set(x,y,z)
	scene.add(group);
	enemyList.push(group)
}

function killEnemy(index) {
	scene.remove(enemyList[index]);
	enemyList.slice(index);

}

function toggleGame() {
	console.log('toggle')
	if(gameMode) {
		gameMode = false;
		document.getElementById('imgshitb4').style.display = 'none'
		console.log('endinggame')
	}
	else {
		gameMode = true;
		console.log('startinggame')
		//DO INITIALIZATION SHIT
		document.getElementById('imgshitb4').style.display = 'block';
		addSaucer(100,50,0)
		addSaucer(0,0,0)
		addSaucer(-100,250,20)
		addSaucer(-100,-20,-250)
		addSaucer(-20,60,-100)
		addSaucer(20,-120,20)
	}

}
