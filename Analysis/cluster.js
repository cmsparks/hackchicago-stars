const fs = require('fs')

//misc helper functions


function getRandomElement(list) {
	return list[Math.floor(Math.random() * list.length)]
}

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

function listEquals(l1, l2) {
	if (l1.length != l2.length) {
		return false
	}
	for (let i = 0; i < l1.length; i++) {
		if (l1[1].length != l2[i].length) {
			return false
		}
		for (let k = 0; k < l1[i].length; k++) {
			if (l1[i][k] != l2[i][k]) {
				return false
			}
		}
	}	
	return true
}

function euclideanDistance(x, y) {
	var sum = 0
	var deltaN
	for (let i = 0; i < x.length; i++) {
		deltaN = x[i] - y[i]
		sum += deltaN * deltaN
	}
	return sum
}

//classes and helpers


class Cluster {
	constructor(centroid, id) {
		this.centroid = centroid
		this.points = []
		this.id = id
	}
	//updates the centroid of the cluster
	getCentroid() {
		var centroid = []

		for (let i = 0; i < this.points[0].length; i++) {
			centroid.push(0)
		}

		//loops through points
		for (let p = 0; p < this.points.length; p++) {
			//loops through dimension
			for (let d = 0; d < centroid.length; d++) {
				centroid[d] += this.points[p][d]
			}
		}

		for (let d = 0; d < centroid.length; d++) {
			centroid[d] /= this.points.length
		}
		this.centroid = centroid
	}
}

//returns the id of the cluster with the nearest centroid by euclidean distance
function getCluster(loc, clusters) {
	var clusterIndex = 0
	var clusterDistance = euclideanDistance(loc, clusters[clusterIndex].centroid)
	var newClusterDistance
	for (let i = 1; i < clusters.length; i++) {
		newClusterDistance = euclideanDistance(loc, clusters[i].centroid)
		if (newClusterDistance < clusterDistance) {
			clusterIndex = i
			clusterDistance = newClusterDistance
		}
	}
	return clusterIndex
}

//running through the shit

// attributes is a list of the indices of the attributes to keep
//makes the array contain only those columns
function selectAttributes(points, attributes) {
	var newPoints = []
	var row

	for (let r = 0; r < points.length; r++) {
		row = []
		for (let i = 0; i < attributes.length; i++) {
			row.push(points[r][attributes[i]])
		}
		newPoints.push(row)
	}

	return newPoints
}

//scales each attribute so it's from 0 to 1
function normalizeData(points) {
	var mins = points[0].slice()
	var maxs = points[0].slice()

	//gets minimum and maximum value for each attribute
	for (let p = 1; p < points.length; p++) {
		for (let d = 0; d < mins.length; d++) {
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
	for (let d = 0; d < mins.length; d++) {
		min = mins[d]
		max = maxs[d]

		for (let p = 0; p < points.length; p++) {
			points[p][d] = (points[p][d] - min) / (max - min)
		}
	}

	return points
}

//creates the clusters based off the list of points given
function isntantiateClusters(points, n) {
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
function allocatePoints(clusters, points) {
	//cleans each clusters list of points
	for (let i = 0; i < clusters.length; i++) {
		clusters[i].points = []
	}

	var cluster
	var clusterIndex
	//allocates each point
	for(let i = 0; i < points.length; i++) {
		cluster = clusters[getCluster(points[i], clusters)]
		cluster.points.push(points[i])
	}
}

//returns n clusters
function cluster(points, n) {
	//normalize data
	points = normalizeData(points)

	//instantiate clusters randomly
	var clusters = isntantiateClusters(points, n)

	//get the centroids of each cluster
	var centroids = []
	for (let i = 0; i < clusters.length; i++) {
		centroids.push(clusters[i].centroid)
	}

	//get the starting points for each cluster
	allocatePoints(clusters, points)

	//updates the clusters and records centroids
	var newCentroids = []
	for (let i = 0; i < clusters.length; i++) {
		clusters[i].getCentroid()
		newCentroids.push(clusters[i].centroid)
	}

	//iterates until no further changes are made
	while (!listEquals(centroids, newCentroids)) {
		centroids = newCentroids

		allocatePoints(clusters, points)

		newCentroids = []
		for (let i = 0; i < clusters.length; i++) {
			clusters[i].getCentroid()
			newCentroids.push(clusters[i].centroid)
		}
	}


	return clusters
}

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

points = selectAttributes(points, [0, 2, 4])

var clusters = cluster(points, 2)

console.log(clusters[0].points)
console.log(clusters[1].points)*/


let points = JSON.parse(fs.readFileSync('../starsJSON.json', 'utf8')).data
points = selectAttributes(points, [0,1,2,3,4])

clusters = cluster(points, 5)

numClusters = clusters.length
data = combClusters(clusters)

json = {
	'numClusters' : numClusters,
	'data' : data
}
console.log(json)