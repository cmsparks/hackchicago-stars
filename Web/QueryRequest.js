function getRadialChunk(MIN_RA, MAX_RA, MIN_PARALLAX, MAX_PARALLAX, MIN_DEC, MAX_DEC) {
	console.log('asdfsdfasdfasd')
	let RequestUrl = 'http://localhost:8080/getRadialChunk?MIN_RA='+MIN_RA+'&MAX_RA='+MAX_RA+'&MIN_PARALLAX='+MIN_PARALLAX+'&MAX_PARALLAX='+MAX_PARALLAX+'&MIN_DEC='+MIN_DEC+'&MAX_DEC='+MAX_DEC
	console.log(RequestUrl)
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == XMLHttpRequest.DONE) {
	        console.log(xhr.responseText);
	    }
	}
	xhr.open('GET', RequestUrl, true);
	xhr.send(null);

}

getRadialChunk(44,45,50,75,55,60);
