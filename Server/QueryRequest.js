const app = require('express')();
const http = require('http').Server(app);
const request = require('request');
const cors = require('cors')

app.use(cors())


app.get('/getRadialChunk', function(req, res) {
	console.log('getting')
	let chunk = "test"
	getRadialChunk(res,req.query.MIN_RA,req.query.MAX_RA,req.query.MIN_PARALLAX,req.query.MAX_PARALLAX,req.query.MIN_DEC,req.query.MAX_DEC)
	res.setHeader('Content-Type', 'application/json')
})

http.listen(8080, function() {
	console.log('lasdfasldfasdf;sad;f;adsfl;hkadsfh;kh;adf')
})




function getRadialChunk(res, MIN_RA, MAX_RA, MIN_PARALLAX, MAX_PARALLAX, MIN_DEC, MAX_DEC) {
	let RequestUrl = 'http://gea.esac.esa.int/tap-server/tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY=SELECT+TOP+100000+ra,dec,parallax,phot_g_mean_mag,phot_bp_mean_mag,phot_bp_mean_mag+FROM+gaiadr2.gaia_source+WHERE+gaiadr2.gaia_source.ra>'+MIN_RA+'+AND+gaiadr2.gaia_source.ra<'+MAX_RA+'+AND+gaiadr2.gaia_source.parallax>'+MIN_PARALLAX+'+AND+gaiadr2.gaia_source.parallax<'+MAX_PARALLAX+'+AND+gaiadr2.gaia_source.dec>'+MIN_DEC+'+AND+gaiadr2.gaia_source.dec<'+MAX_DEC;
	
	console.log(RequestUrl);

	let options = {
		method: 'GET',
		url: RequestUrl
	}
	console.log('requesting')
	request(options, function(error, response, body) {
		if (error) {console.log("error")};
		console.log(body)
		res.write(body);
		res.end();
	});
}

