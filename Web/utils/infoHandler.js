let starClassifier;
function handleInfo(star) {
	//set all the information
	starClassifier = new spectralClassifier(star)
	let mass = starClassifier.getMass()
	let radius = starClassifier.getRadius();
	let volume = Math.PI*((radius*695700000)^2);
	let density = (Math.pow(1.98855,33)*mass)/volume;
	//density is super inaccurate right now idk why
	populateName(star[6]);
	populateClass(star[5], starClassifier.verboseName);
	populateTemp(starClassifier.getTemp());
	populateMass(mass);
	populateRadius(radius);
	//populateDensity(density);
	populateLuminosity(star[4]);
	populateColorIndex(star[0]);
	populateDistance(starClassifier.getDistance());
	document.getElementById('detailPane').style.display = "grid";
}

function populateColorIndex(ci) {
	let ciSel = document.getElementsByClassName('colorIndex');
	for(let i = 0; i<ciSel.length; i++) {
		ciSel[i].innerHTML = ci;
	}
}

function populateName(star) {
	let nameSel = document.getElementsByClassName('name')

	for(let i = 0; i<nameSel.length; i++){
		nameSel[i].innerHTML = star;
	}
}

function populateClass(starClass, verboseClass) {
	let classSel = document.getElementsByClassName('class');
	let verboseClassSel = document.getElementsByClassName('verboseClass');
	console.log(classSel)
	for(let i = 0; i<classSel.length; i++){
		classSel[i].innerHTML = starClass;
		console.log("asdfasdf")
	}
	for(let i = 0; i<verboseClassSel.length; i++) {
		verboseClassSel[i].innerHTML = verboseClass;
	}
}

function populateMass(starMass) {
	if(starMass > .1) {
		starMass = Math.floor(starMass*100);
		starMass = starMass/100;
	}
	else if(starMass > 0.00001) {
		starMass = Math.floor(starMass *1000);
		starMass = starMass/1000;
	}
	let massSel = document.getElementsByClassName('mass');
	let relMassSel = document.getElementsByClassName('relMass');
	for(let i = 0; i<massSel.length; i++){
		massSel[i].innerHTML = starMass;
	}
	for(let i = 0; i<relMassSel.length; i++){
		relMassSel[i].innerHTML = relMass;
	}
}

function populateRadius(radius) {
	if(radius > .1) {
		radius = Math.floor(radius*100);
		radius = radius/100
	}
	if(radius === 1.01) {
		//corrects for the Sun's radius, because the temperature calculation is
		//slightly off due to not taking into account luminosity
		//and the radius is calculated using that slightly off luminosity
		//calculation
		radius = 1;
	}

	let radiusSel = document.getElementsByClassName('radius')
	for(let i = 0; i<radiusSel.length; i++) {
		radiusSel[i].innerHTML = radius;
	}
}

function populateDistance(distance) {
	if(distance > 1){
		distance = Math.floor(distance*100);
		distance = distance/100;
	}
	let distSel = document.getElementsByClassName('distance');
	for(let i = 0; i<distSel.length; i++) {
		distSel[i].innerHTML = distance;
	}
}
/* Removed until we have a better density calculation
function populateDensity(density) {
	if(density > 1) {
		density = Math.floor(density*100);
		density = density/100;
	}
	let densitySel = document.getElementsByClassName('density');
	for(let i = 0; i<densitySel.length; i++) {
		densitySel[i].innerHTML = density;
	}
}*/

function populateLuminosity(luminosity) {
	if(luminosity > 1) {
		luminosity = Math.floor(luminosity*100);
		luminosity = luminosity/100;
	}
	let luminositySel = document.getElementsByClassName('luminosity');
	for(let i = 0; i<luminositySel.length; i++) {
		luminositySel[i].innerHTML = luminosity;
	}
}

function populateTemp(temp) {
	if(temp > 10){
		temp = Math.floor(temp*100);
		temp = temp/100;
	}
	let tempSel = document.getElementsByClassName('temperature');
	for(let i = 0; i<tempSel.length; i++) {
		tempSel[i].innerHTML = temp;
	}
}

function loadComparison() {

}

function closeInfo() {
	document.getElementById('detailPane').style.display = "none";
	focus = true;
	animate();
}