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
