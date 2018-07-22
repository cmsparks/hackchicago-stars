class RadialCluster {
	constructor(ra,dec,parallax) {
		let geometry = new THREE.BufferGeometry
	}
	
	generateStarGeometry(data) {
		let positionArray = [];
		let colorArray = [];
		let sizeArray = [];

		for(let i = 0; i < data.length; i++) {
			let rgb = bvToRBG(data[i][0])
			rgb[0] /= 255
			rgb[1] /= 255
			rgb[2] /= 255

			if(rgb)
		}
	}

}
