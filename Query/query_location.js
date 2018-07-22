//angle width of chunks that border Earth in degres
baseAngle = 15

//radius of each chunk in parsecs
chunkRadius = 1

//gets how many chunks the viewer is away from Earth
function getChunkLevel(playerDistanceFromEarth) {
	return Math.ceil(playerDistanceFromEarth / chunkRadius)
}

//gets the angle between chunks from Earth's perspective 
function getAngleDifference(chunkLevel) {
	//divides base angle into c^3 - (c-1)^3 subsections so that area is constant
	return baseAngle / (3 * chunkLevel * chunkLevel - 3 * chunkLevel - 1)
}

//finds start inclination
function getStartInclination(angleDifference, playerInclination) {
	return angleDifference * Math.floor(playerInclination / angleDifference)
}

function getStartRightAscension(angleDifference, playerRightAscension) {
	return angleDifference * Math.floor(playerRightAscension / angleDifference)
}

//takes in distance, incline, right ascension
//returns [startDistance, endDistance, startIncline, endIncline, startRA, endRA]
function queryList(playerDistanceFromEarth, playerInclination, playerRightAscension) {
	var endChunk = getChunkLevel(playerDistanceFromEarth)
	var angleDifference = getAngleDifference(endChunk)
	console.log(angleDifference)
	var startInclination = getStartInclination(angleDifference, playerInclination)
	var startRightAscension = getStartRightAscension(angleDifference, playerRightAscension)
	return [(endChunk - 1) * chunkRadius, endChunk * chunkRadius, startInclination, startInclination + angleDifference, startRightAscension, startRightAscension + angleDifference]
}

pd = 11.7
pi = 23
pra = 143

console.log(queryList(pd,pi,pra))