//misc helper functions


function getRandomElement(list) {
	return list[Math.floor(Math.random() * list.length)]
}

function listEquals(l1, l2) {
	if (l1.length != l2.length) {
		return false
	}
	for (i = 0; i < l1.length; i++) {
		if (l1[i] != l2[i]) {
			return False
		}
	}
	return True
}

function euclideanDistance(x, y) {
	var sum = 0
	var deltaN
	for (i = 0; i < x.length; i++) {
		deltaN = x[i] - y[i]
		sum += deltaN * deltaN
	}
	return sum
}

//classes


class Cluster {
	constructor(centroid, id) {
		this.centroid = centroid
		this.points = []
		this.id = id
	}
	//updates the centroid of the cluster
	getCentroid() {
		var centroid = self.points[0]
		//loops through points
		for (p = 1; p < self.points.length; p++) {
			//loops through dimension
			for (d = 0; d < centroid.length; d++) {
				centroid[d] += self.points[p][d]
			}
		}
		for (d = 0; d < centroid.length; d++) {
			centroid[d] /= self.points.length
		}
		self.centroid = centroid
	}
}

//methods


//returns the id of the cluster with the nearest centroid by euclidean distance
function getCluster(loc, clusters) {
	var clusterIndex = 0
	var clusterDistance = euclideanDistance(loc, clusters[cindex].centroid)
	var newClusterDistance

	for (i = 1; i < clusters.length; i++) {
		newClusterDistance = euclideanDistance(loc, clusters[i].centroid)
		if (newClusterDistance < clusterDistance) {
			clusterIndex = i
			clusterDistance = newClusterDistance
		}
	}
	return clusterIndex
}

//running through the shit


//creates the clusters based off the list of points given
function isntantiateClusters(points, n) {
	var clusters = []
	var centroid

	//creates n clusters with randomized centroids
	for (i = 0; i < n; i++) {
		centroid = getRandomElement(points)
		clusters.push(new Cluster(centroid, i))
	}

	return clusters
}

//assigns each point to the closest cluster
function allocatePoints(clusters, points) {
	//cleans each clusters list of points
	for (i = 0; i < clusters.length; i++) {
		clusters[i].points = []
	}

	//allocates each point
	for(i = 0; i < points.length; i++) {
		clusters[getCluster(points[i], clusters)].points.push(points[i])
	}
}

//returns n clusters
function cluster(points, n) {
	//instantiate clusters randomly
	var clusters = isntantiateClusters(points, n)

	//get the centroids of each cluster
	var centroids = []
	for (i = 0; i < clusters.length; i++) {
		centroids.push(clusters[i].centroid)
	}

	//get the starting points for each cluster
	allocatePoints(clusters, points)

	//updates the clusters and records centroids
	var newCentroids = []
	for (i = 0; i < clusters.length; i++) {
		clusters[i].getCentroid()
		newCentroids.push(clusters[i].centroid)
	}

	//iterates until no further changes are made
	while (centroids != newCentroids) {
		centroids = newCentroids

		allocatePoints(clusters, points)

		newCentroids = []
		for (i = 0; i < clusters.length; i++) {
			clusters[i].getCentroid()
			newCentroids.push(clusters[i].centroid)
		}
	}


	return clusters
}