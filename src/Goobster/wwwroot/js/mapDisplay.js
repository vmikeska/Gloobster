var Gloobster = Gloobster || {};
Gloobster.Maps = Gloobster.Maps || {};

Gloobster.Maps.Displayer = function () {

    this.showVisitedPlaces = function(places) {
        
    }

    this.showVisitedCountries = function (countries) {

    }

    function drawOneCountry(iso3Code, earth, color) {
        var polygonCoordinatesGroup = getCoordinatesByCountry(iso3Code);

        if (!polygonCoordinatesGroup) {
            return;
        }

        var fillColor = '#009900';
        if (color) {
            fillColor = color;
        }

        for (var actPolygon = 0; actPolygon <= polygonCoordinatesGroup.length - 1; actPolygon++) {

            var polygon = WE.polygon(polygonCoordinatesGroup[actPolygon], {
                color: fillColor,
                opacity: 1,
                fillColor: fillColor,
                fillOpacity: 0.5,
                weight: 2
            }).addTo(earth);

        }

    }

    function drawAllCountries(earth) {
        for (var actCountry = 0; actCountry <= allIso3CountryCodes.length - 1; actCountry++) {
            var currentCountryCode = allIso3CountryCodes[actCountry];

            drawOneCountry(currentCountryCode, earth);
        }
    }

};

Gloobster.Maps.Creator = function (config) {

    this.initializeGlobe = function(type) {

        var mapOptions = {};
        var layerOptions = {};
        var mapUrl = '';

        if (type === 'OSM') {
            mapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }

        if (type === 'MQCDN') {
            mapUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg';
            mapOptions = { atmosphere: true, center: [0, 0], zoom: 0 };
            layerOptions = {
                subdomains: '1234',
                attribution: 'Tiles Courtesy of MapQuest'
            };
        }

        if (type === 'MQCDN1') {
            mapUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
            layerOptions = {
                attribution: 'Tiles Courtesy of MapQuest'
            }
        }

        var earth = new WE.map(config.earthDiv, mapOptions);
        WE.tileLayer(mapUrl,layerOptions).addTo(earth);
    }

};
