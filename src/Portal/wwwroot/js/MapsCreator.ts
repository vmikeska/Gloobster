
enum MapTypes { OSM, MQCDN, MQCDN1 };

class MapsCreator {

		public earthDiv: string;
		public earth: any;

		constructor(earthDiv) {
				this.earthDiv = earthDiv;
		}

    public initializeGlobe(mapType: MapTypes) {

        var mapOptions = {};
        var layerOptions = {};
        var mapUrl = '';

        if (mapType === MapTypes.OSM) {
            mapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }

        if (mapType === MapTypes.MQCDN) {
            mapUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg';
            mapOptions = { atmosphere: true, center: [0, 0], zoom: 0 };
            layerOptions = {
                subdomains: '1234',
                attribution: 'Tiles Courtesy of MapQuest'
            };
        }

        if (mapType === MapTypes.MQCDN1) {
            mapUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
            layerOptions = {
                attribution: 'Tiles Courtesy of MapQuest'
            }
        }

        this.earth = new WE.map(this.earthDiv, mapOptions);
        WE.tileLayer(mapUrl, layerOptions).addTo(this.earth);
    }

};