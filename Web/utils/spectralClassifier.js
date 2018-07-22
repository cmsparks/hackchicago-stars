// spectralClassifier.js
// Unfortunately, the spectral classification system
// is inconsistent and has no easy value delimitation
// so this is mostly just a chain of if statements.
// Ideally for larger datasets you are going to want to 
// convert everything into multiple separate values initially
// because it is relatively slow to classify larger datasets.
class spectralClassifier {
	constructor(star) {
		this.star = star;
		this.type = star[5];
		this.luminosity = star[4];
		this.ci = star[0];
		let endClass = 0;
		let endYerkes = 0;
		let endSubclass = 0;
		let numRegex = new RegExp(/[0-9]/)
		//get index of the class indicator
		console.log(this.type.search(numRegex))
		if(-1<this.type.search(numRegex)){
			endClass = this.type.search(numRegex);
		}
		//get index of the luminosity indicator
		if(-1<this.type.indexOf("V")&&(this.type.indexOf("V")<this.type.indexOf("I")||-1===this.type.indexOf("I"))) {
			endSubclass = this.type.indexOf("V")
			if(this.type.lastIndexOf("V") > this.type.lastIndexOf("I")) {
				endYerkes = this.type.lastIndexOf("V");
			}
			else {
				endYerkes = this.type.lastIndexOf("I");
			}
		}
		else if (-1<this.type.indexOf("I")) {
			endSubclass = this.type.indexOf("I")
			if(this.type.lastIndexOf("V") > this.type.lastIndexOf("I")) {
				endYerkes = this.type.lastIndexOf("V");
			}
			else {
				endYerkes = this.type.lastIndexOf("I");
			}			
		}
		this.colorIndex = star[0];
		this.harvard = this.type.substring(0,endClass);
		this.subClass = this.type.substring(endClass, endSubclass);
		this.yerkes = this.type.substring(endSubclass,endYerkes+1)
		this.peculiarities = this.type.substring(endYerkes+1,this.type.length)
		console.log(this.harvard);
		this.setHarvardData();
		//make verbose name if lum class doesnt exist
		this.setYerkesData();
	}

	setHarvardData() {
		// this is ordered by frequency which should speed up
		// computation of the types of the HYG dataset.
		if(this.harvard === "M") {
			// 2,400–3,700 K, 0.08–0.45 M☉, ≤ 0.7 R☉, ≤ 0.08 L☉, Very weak Hydrogen Lines
			this.tempHigh = 3700;
			this.tempLow = 2400;
			this.subClassHigh = 9.5;
			this.subClassLow = 0;
			this.massHigh = 0.45;
			this.massLow = 0.08;
			this.radiusHigh = 0.7;
			this.radiusLow = 0; //fix
			this.smallName = "Red"
			this.largeName = "M-Type"
		}
		else if(this.harvard === "K") {
			// 3,700–5,200 K, 0.45–0.8 M☉, 0.7–0.96 R☉, 0.08–0.6 L☉, Very weak Hydrogen lines
			this.tempHigh = 5200;
			this.tempLow = 3700;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 0.8;
			this.massLow = 0.45;
			this.radiusHigh = 0.96;
			this.radiusLow = 0.7;
			this.verboseName = "K-Type Main-Sequence Star"
		}
		else if(this.harvard === "G") {
			// 5,200–6,000 K, 0.8–1.04 M☉, 0.96–1.15 R☉, 0.6–1.5 L☉, Weak Hydrogen Lines
			this.tempHigh = 6000;
			this.tempLow = 5200;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 1.04;
			this.massLow = 0.8;
			this.radiusHigh = 1.15;
			this.radiusLow = 0.96;
			this.smallName = "G-Type"
			this.largeName = "Yellow"
		}
		else if(this.harvard === "F") {
			// 6,000–7,500 K, 1.04–1.4 M☉, 1.15–1.4 R☉, 1.5–5 L☉, Medium Hydrogen Lines
			this.tempHigh = 7500;
			this.tempLow = 6000;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 1.4;
			this.massLow = 1.04;
			this.radiusHigh = 1.4;
			this.radiusLow = 1.15;
			this.verboseName = "F-Type Main-Sequence Star";
		}
		else if(this.harvard === "A") {
			//7,500–10,000 K, 1.4–2.1 M☉, 1.4–1.8 R☉, 5–25 L☉, Strong Hydrogen Lines
			this.tempHigh = 10000;
			this.tempLow = 7500;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 2.1;
			this.massLow = 1.4;
			this.radiusHigh = 1.8;
			this.radiusLow = 1.4;
			this.verboseName = "A-Type Main-Sequence Star"
		}
		else if(this.harvard === "B") {
			// 10,000–30,000 K, 2.1–16 M☉, 1.8–6.6 R☉, 25–30,000 L☉, Medium Hydrogen Lines
			this.tempHigh = 30000;
			this.tempLow = 10000;
			this.subClassHigh = 0;
			this.subClassLow = 9;
			this.massHigh = 16;
			this.massLow = 2.1;
			this.radiusHigh = 6.6;
			this.radiusLow = 1.8;
			this.largeName = "Blue";
			this.smallName = "B-Type"
		}
		else if(this.harvard === "O") {
			// Temp > 30,000 K, ≥ 16 M☉, ≥ 6.6 R☉, ≥ 30,000 L☉, Weak Hydrogen Lines
			this.tempHigh = 36000;
			this.tempLow = 30000;
			this.subClassHigh = 2;
			this.subClassLow = 9.5;
			this.massHigh = 130; //fix
			this.massLow = 16;
			this.radiusHigh = 35; //fix
			this.radiusLow = 6.6;
			this.largeName = "Blue";
			this.smallName = "O-Type"
		}
		//dwarves
		else if(this.harvard === "DA") {
			//Hydrogen rich atmosphere, strong Balmer hydrogen spectral lines
			this.verboseName = "White Dwarf";
			this.tempHigh = 40000;
			this.tempLow = 8000;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 1;
			this.massLow = 0.3;
			this.radiusHigh = 0.02;
			this.radiusLow = 0.008;
		}
		else if(this.harvard === "DB") {
			// Helium rich atmosphere, neutral helium, He I
			this.verboseName = "White Dwarf";
			this.tempHigh = 40000;
			this.tempLow = 8000;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 1;
			this.massLow = 0.3;
			this.radiusHigh = 0.02;
			this.radiusLow = 0.008;
		}
		else if(this.harvard === "DO") {
			// Helium rich atmosphere, ionized helium, He II
			this.verboseName = "White Dwarf";
			this.tempHigh = 40000;
			this.tempLow = 8000;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 1;
			this.massLow = 0.3;
			this.radiusHigh = 0.02;
			this.radiusLow = 0.008;
		}
		else if(this.harvard === "DQ") {
			// Carbon rich atmosphere
			this.verboseName = "White Dwarf";
			this.tempHigh = 40000;
			this.tempLow = 8000;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 1;
			this.massLow = 0.3;
			this.radiusHigh = 0.02;
			this.radiusLow = 0.008;
		}
		else if(this.harvard === "DZ") {
			// Metal rich atmosphere
			this.verboseName = "White Dwarf";
			this.tempHigh = 40000;
			this.tempLow = 8000;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 1;
			this.massLow = 0.3;
			this.radiusHigh = 0.02;
			this.radiusLow = 0.008;
		}
		else if(this.harvard === "DC") {
			// No strong spectral lines
			this.tempHigh = 40000;
			this.verboseName = "White Dwarf";
			this.tempLow = 8000;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 1;
			this.massLow = 0.3;
			this.radiusHigh = 0.02;
			this.radiusLow = 0.008;
		}
		else if(this.harvard === "DX") {
			// No well defined dwarf classification
			this.tempHigh = 40000;
			this.verboseName = "White Dwarf";
			this.tempLow = 8000;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 1;
			this.massLow = 0.3;
			this.radiusHigh = 0.02;
			this.radiusLow = 0.008;
		}
		else if(this.harvard === "D") {
			this.tempHigh = 40000;
			this.verboseName = "White Dwarf";
			this.tempLow = 8000;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 1;
			this.massLow = 0.3;
			this.radiusHigh = 0.02;
			this.radiusLow = 0.008;
		}
		//Wolf Rayet - TODO: fix WR and ordering of mass/temperature
		else if(this.harvard === "WR") {
			this.verboseName = "Wolf Rayet Star";
			this.tempHigh = 141000;
			this.tempLow = 35000;
			this.subClassHigh = 11;
			this.subClassLow = 0;
			this.massHigh = 74;
			this.massLow = 15;
			this.radiusHigh = 25;
			this.radiusLow = 1;
		}
		else if(this.harvard === "WN") {
			this.tempHigh = 141000;
			this.verboseName = "Wolf Rayet Star";
			this.tempLow = 35000;
			this.subClassHigh = 11;
			this.subClassLow = 0;
			this.massHigh = 74;
			this.massLow = 15;
			this.radiusHigh = 25;
			this.radiusLow = 1;

		}
		else if(this.harvard === "WC") {
			this.tempHigh = 200000;
			this.verboseName = "Wolf Rayet Star";
			this.tempLow = 44000;
			this.subClassHigh = 11;
			this.subClassLow = 0;
			this.massHigh = 19;
			this.massLow = 10;
			this.radiusHigh = 6.6;
			this.radiusLow = 0.6;

		}
		//other
		else if(this.harvard === "C") {
			//Carbon stars, red giants near the end of their lives
			//fix mass and radius
			this.verboseName = "Carbon Star"
			this.tempHigh = 4500;
			this.tempLow = 3450;
			this.subClassHigh = 6;
			this.subClassLow = 0;
			this.massHigh = 2.0;
			this.massLow = 1.5;
			this.radiusHigh =  526;
			this.radiusLow = 150;
		}
		else if(this.harvard === "S") {
			this.verboseName = "S-Type Star"
			this.tempHigh = 4000;
			this.tempLow = 2300;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 2.0;
			this.massLow = 1.5;
			this.radiusHigh =  526;
			this.radiusLow = 150;
		}
		else if(this.harvard === "SC") {
			// Mix between S class and C class
			this.verboseName = "SC-Type Star"
			this.tempHigh = 4000;
			this.tempLow = 2300;
			this.subClassHigh = 9;
			this.subClassLow = 0;
			this.massHigh = 2.0;
			this.massLow = 1.5;
			this.radiusHigh =  526;
			this.radiusLow = 150;
		}
		else {
			//unknown classification

		}
	}

	getTemp() {

	}

	getSize() {

	}

	setYerkesData() {
		//Sets name of all of the stars
		console.log("???")
		if(this.yerkes === "VII") {
			//White Dwarf
			if(this.verboseName===undefined){
				this.verboseName = this.largeName+" White Dwarf";;
			}
		}
		else if(this.yerkes === "VI") {
			//Subdwarf
			if(this.verboseName===undefined){
				this.verboseName = this.largeName+" Subdwarf";;
			}
		}
		else if(this.yerkes === "V") {
			//Main-Sequence stars (Dwarfs)
			console.log("???")
			if(this.verboseName===undefined){
				this.verboseName = this.smallName+" Main-Sequence Star";
				if(this.smallName === "Red") {
					this.verboseName = "Red Dwarf"
				}
				console.log(this.verboseName)
			}
		}
		else if(this.yerkes === "IV") {
			//Subgiants
			if(this.verboseName===undefined){
				this.verboseName = this.largeName+" Subgiant";
			}
		}
		else if(this.yerkes === "III") {
			//Normal Giants
			if(this.verboseName===undefined){
				this.verboseName = this.largeName+" Giant";
			}
		}
		else if(this.yerkes === "II") {
			//Bright Giants
			if(this.verboseName===undefined){
				this.verboseName = this.largeName+" Bright Giant";
			}
		}
		else if(this.yerkes === "Ib") {
			//Less luminous supergiants
			if(this.verboseName===undefined){
				this.verboseName = this.largeName+" Supergiant";
			}
		}
		else if(this.yerkes === "Iab") {
			//Intermediate-size supergiants
			if(this.verboseName===undefined){
				this.verboseName = this.largeName+" Supergiant";
			}
		}
		else if(this.yerkes === "Ia") {
			//Luminous supergiants
			if(this.verboseName===undefined){
				this.verboseName = this.largeName+" Supergiant";
			}
		}
		else if (this.yerkes === "Ia+") {
			//Hypergiants/Extremely Luminous Supergiants
			if(this.verboseName===undefined){
				this.verboseName = this.largeName+" Hypergiant";
			}
		}
		else {
			//Error: Unknown luminosity
			this.verboseName = "Unknown Class"
		}
	}

	getTemp() {
		//get the temperature and apply that to the harvard classification
		//need to do either tabled interpolation or take luminosity into account
		//current eqn assumes that the star is a black body
		return 4600*((1/(0.92*this.ci+1.7))+(1/(0.92*this.ci+0.62)))
	}

	getMass() {
		//Does a mass-luminosity relation - not the most accurate but okish
		//https://en.wikipedia.org/wiki/Mass%E2%80%93luminosity_relation
		// Mstar/Msol^a = Lstar/Lsol
		if(((this.massHigh+this.massLow)/2) < 0.43) {
			return Math.pow((this.luminosity/0.23), (1/2.3));
		}
		else if(((this.massHigh+this.massLow)/2) < 2) {
			return Math.pow(this.luminosity, 1/4);
		}
		else if(((this.massHigh+this.massLow)/2) < 20) {
			return Math.pow((this.luminosity/1.5), (1/(3.5)));
		}
		else {
			return (this.luminosity/3200)
		}
	}

	getRadius() {
		//does a luminosity vs temp vs radius calculation given
		//the luminosity and temperature
		//L = R^2 * T^4
		let temp = this.getTemp();
		return (Math.pow((5800/temp),2)*Math.pow((this.luminosity/1),1/2));

	}

	getPeculiarities() {

	}

	getColor() {

	}

	getClassInformation() {

	}

	getDistance() {
		return Math.sqrt(this.star[1]*this.star[1]+this.star[2]*this.star[2]+this.star[3]*this.star[3]);
	}
}

//exports.spectralClassifier = spectralClassifier
