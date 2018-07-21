# hackchicago-stars

Curent Data Query - Modify to the data provider that we are using
```
SELECT TOP 100000 ra,dec,parallax,phot_g_mean_mag,phot_bp_mean_mag,phot_bp_mean_mag
FROM gaiadr2.gaia_source
WHERE gaiadr2.gaia_source.ra>MIN_RA
	AND gaiadr2.gaia_source.ra<MAX_RA
	AND gaiadr2.gaia_source.parallax>MIN_PARALLAX
	AND gaiadr2.gaia_source.parallax<MAX_PARALLAX
	AND gaiadr2.gaia_source.dec>MIN_DEC
	AND gaiadr2.gaia_source.dec<MAX_DEC
```

Request URL
```
http://gea.esac.esa.int/tap-server/tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY=SELECT+TOP+100000+ra,dec,parallax,phot_g_mean_mag,phot_bp_mean_mag,phot_bp_mean_mag+FROM+gaiadr2.gaia_source+WHERE+gaiadr2.gaia_source.ra>MIN_RA+AND+gaiadr2.gaia_source.ra<MAX_RA+AND+gaiadr2.gaia_source.parallax>MIN_PARALLAX+AND+gaiadr2.gaia_source.parallax<MAX_PARALLAX+AND+gaiadr2.gaia_source.dec>MIN_DEC+AND+gaiadr2.gaia_source.dec<MAX_DEC
```

Node Server Request URL 
```
localhost:8080/getRadialChunk?MIN_RA=40&MAX_RA=45&MIN_PARALLAX=0&MAX_PARALLAX=75&MIN_DEC=55&MAX_DEC=60
```
