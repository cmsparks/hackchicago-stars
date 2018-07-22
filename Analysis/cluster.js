const fs = require('fs')

//misc helper functions


//returns n distinct indexes for items in an array
function getNRandomElements(list, n) {
	var indexs = []
	var leftoverIndexs = [...Array(list.length).keys()]
	var index

	for (let i = 0; i < n; i++) {
		index = Math.floor(Math.random() * leftoverIndexs.length)
		indexs.push(leftoverIndexs[index])
		leftoverIndexs.splice(index, 1)
	}

	return indexs
}

//checks if each element of each list within two lists are the same
function listEquals(l1, l2, elements) {
	//checks if lists are equal length
	if (l1.length != l2.length) {
		return false
	}

	//checks if nested lists are equal
	for (let i = 0; i < l1.length; i++) {
		if (l1[1].length != l2[i].length) {
			return false
		}

		for (let k = 0; k < elements; k++) {
			if (l1[i][k] != l2[i][k]) {
				return false
			}
		}
	}	
	return true
}

//finds the euclidean distance between two points in an 
//n-dimensional space
function euclideanDistance(x, y, elements) {
	var sum = 0
	var deltaN

	for (let i = 0; i < elements; i++) {
		deltaN = x[i] - y[i]
		sum += deltaN * deltaN
	}
	return sum
}

//CLUSTERING


class Cluster {
	constructor(centroid, id) {
		this.centroid = centroid
		this.points = []
		this.id = id
	}

	//updates the centroid of the cluster
	getCentroid(elements) {
		var centroid = []

		for (let i = 0; i < elements; i++) {
			centroid.push(0)
		}

		//loops through points
		for (let p = 0; p < this.points.length; p++) {
			//loops through dimension
			for (let d = 0; d < elements; d++) {
				centroid[d] += this.points[p][d]
			}
		}

		for (let d = 0; d < elements; d++) {
			centroid[d] /= this.points.length
		}
		this.centroid = centroid
	}
}

//returns the attribute arg for cluster functions based on the
//strings of which attribues they requested
 function getAttributeIndices(attributes) {
 	var indices = []
 	var index

 	for (let i = 0; i < attributes.length; i++) {
 		index = header.indexOf(attributes[i])
 		if (index != -1) {
 			indices.push(index)
 		}
 	}
 	return indices
 }

// attributes is a list of the indices of the attributes to keep
//makes the array contain only those columns
function selectAttributes(points, attributes) {
	var newPoints = []
	var row
	var info

	for (let r = 0; r < points.length; r++) {
		row = []
		info = []
		//puts selected attributes at beginning and info at the end
		for (let i = 0; i < points[r].length; i++) {
			if (attributes.includes(i)) {
				row.push(points[r][i])
			}
			else {
				info.push(points[r][i])
			}
		}
		newPoints.push(row.concat(info))
	}

	return newPoints
}

//scales each attribute so it's from 0 to 1
function normalizeData(points, elements) {
	var mins = points[0].slice()
	var maxs = points[0].slice()

	//gets minimum and maximum value for each attribute
	for (let p = 1; p < points.length; p++) {
		for (let d = 0; d < elements; d++) {
			if (points[p][d] < mins[d]) {
				mins[d] = points[p][d]
			} 
			if (points[p][d] > maxs[d]) {
				maxs[d] = points[p][d]
			} 
		}
	}

	var min
	var max

	//normalizes each attribute
	for (let d = 0; d < elements; d++) {
		min = mins[d]
		max = maxs[d]

		for (let p = 0; p < points.length; p++) {
			points[p][d] = (points[p][d] - min) / (max - min)
		}
	}

	return [points, mins, maxs]
}

//creates the clusters based off the list of points given
function isntantiateClusters(points, n, elements) {
	var clusters = []
	var centroid
	var centroidIndexs = getNRandomElements(points, n)

	//creates n clusters with randomized centroids
	for (let i = 0; i < n; i++) {
		clusters.push(new Cluster(points[centroidIndexs[i]], i))
	}

	return clusters
}

//assigns each point to the closest cluster
function allocatePoints(clusters, points, elements) {
	//cleans each clusters list of points
	for (let i = 0; i < clusters.length; i++) {
		clusters[i].points = []
	}

	var cluster
	var clusterIndex

	//allocates each point
	for(let i = 0; i < points.length; i++) {
		cluster = clusters[getCluster(points[i], clusters, elements)]
		cluster.points.push(points[i])
	}
}

//returns the id of the cluster with the nearest centroid by euclidean distance
function getCluster(loc, clusters, elements) {
	var clusterIndex = 0
	var clusterDistance = euclideanDistance(loc, clusters[clusterIndex].centroid, elements)
	var newClusterDistance

	for (let i = 1; i < clusters.length; i++) {
		newClusterDistance = euclideanDistance(loc, clusters[i].centroid, elements)
		if (newClusterDistance < clusterDistance) {
			clusterIndex = i
			clusterDistance = newClusterDistance
		}
	}
	return clusterIndex
}

//reverses the normalizaData function
function rebuildData(clusters, mins, maxs, elements) {
	for (let c = 0; c < clusters.length; c++) {
		for (let p = 0; p < clusters[c].points.length; p++) {
			for (let a = 0; a < elements; a++) {
				clusters[c].points[p][a] = clusters[c].points[p][a] * (maxs[a] - mins[a]) + mins[a]
			}
		}
	}
	return clusters
}

function reorderAttributes(clusters, attributes) {
	//collects the complement of attributes
	infos = []
	for (let i = 0; i < clusters[0].points[0].length; i++) {
		if (!attributes.includes(i)) {
			infos.push(i)
		}
	}

	//creates index decode key
	var row = []

	for (let i = 0; i < attributes.length; i++) {
		row.push(attributes[i])
	}

	for (let i = 0; i < infos.length; i++) {
		row.push(infos[i])
	}

	var point

	for (let c = 0; c < clusters.length; c++) {
		for (let p = 0; p < clusters[c].points.length; p++) {
			point = []
			for (let d = 0; d < row.length; d++) {
				point[row[d]] = clusters[c].points[p][d]
			}

			clusters[c].points[p] = point
		}
	}
	return clusters
}

//concatonates the clusters into one array where each point's final value 
//says which cluster its in
function combClusters(clusters) {
	var data = []
	for (let i = 0; i < clusters.length; i++) {
		for (let r = 0; r < clusters[i].points.length; r++) {
			clusters[i].points[r].push(i)
			data.push(clusters[i].points[r])
		}
	}
	return data
}

//returns json file where each item gains a label
function cluster(points, n, attributes) {
	//separate data to analyze from info
	points = selectAttributes(points, attributes)

	//normalize data
	nd = normalizeData(points, attributes.length)
	points = nd[0]
	mins = nd[1]
	maxs = nd[2]

	//instantiate clusters randomly
	var clusters = isntantiateClusters(points, n)

	//get the centroids of each cluster
	var centroids = []
	for (let i = 0; i < clusters.length; i++) {
		centroids.push(clusters[i].centroid)
	}

	//get the starting points for each cluster
	allocatePoints(clusters, points, attributes.length, attributes.length)

	//updates the clusters and records centroids
	var newCentroids = []
	for (let i = 0; i < clusters.length; i++) {
		clusters[i].getCentroid(attributes.length)
		newCentroids.push(clusters[i].centroid)
	}

	//iterates until no further changes are made
	while (!listEquals(centroids, newCentroids, attributes.length)) {
		centroids = newCentroids

		allocatePoints(clusters, points, attributes.length)

		newCentroids = []
		for (let i = 0; i < clusters.length; i++) {
			clusters[i].getCentroid(attributes.length)
			newCentroids.push(clusters[i].centroid)
		}
	}


	//reverts the data back to original form
	clusters = rebuildData(clusters, mins, maxs, attributes.length)
	
	//restores attribute order
	clusters = reorderAttributes(clusters, attributes)

	//converts data to exportable json file
	var json = {
		'numClusters' : clusters.length,
		'data' : combClusters(clusters)
	}

	return json

	//return clusters
}


//test

/*var points = []
var point

for (let i = 0; i < 1000000; i++) {
	point = []
	for (let d = 0; d < 5; d++) {
		point.push(Math.floor(Math.random() * 300))
	}
	points.push(point)
}
a
points = selectAttributes(points, [0, 2, 4])

var clusters = cluster(points, 5)
*/


let stars = JSON.parse(fs.readFileSync('../starsJSON.json', 'utf8'))
let points = stars.data
let header = stars.fields
console.log(points)

json = cluster(points, 5, [0,4])
console.log(json)
//fs.writeFileSync("adsfadfadfs.json", JSON.stringify(json), 'utf8')