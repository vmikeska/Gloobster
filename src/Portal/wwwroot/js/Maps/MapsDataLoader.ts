class MapsDataLoader {	
	public owner: Views.ViewBase;

	public places: Maps.Places;
	public viewPlaces: Maps.PlacesDisplay;

	public dataLoadedCallback: Function;

	constructor(owner: Views.ViewBase) {
		this.owner = owner;		
	}

	public getPluginData(pluginType: Maps.PluginType, displayEntity: Maps.DisplayEntity) {

		var request = [["pluginType", pluginType.toString()], ["displayEntity", displayEntity.toString()]];

		this.owner.apiGet("PinBoardStats", request, response => {

			this.places = new Maps.Places();
			this.viewPlaces = new Maps.PlacesDisplay();

			this.places.places = response.VisitedPlaces;
			this.places.cities = response.VisitedCities;
			this.places.countries = response.VisitedCountries;

			this.mapToViewData();

			this.dataLoadedCallback();
		});
	}

	private getColorByNumber(num) {
		var firstColor = "#0026BF";
		if (!num) {
			return firstColor;
		}

		if (num <= 1) {
			return firstColor;
		} else if (num <= 2) {
			return "#1300C2";
		} else if (num <= 3) {
			return "#4F00C6";
		} else if (num <= 4) {
			return "#8D00CA";
		} else if (num <= 5) {
			return "#CE00CE";
		} else if (num <= 6) {
			return "#D20092";
		} else if (num <= 7) {
			return "#D50055";
		} else if (num <= 8) {
			return "#D90015";
		} else if (num <= 9) {
			return "#DD2C00";
		} else if (num <= 10) {
			return "#E17000";
		}

		return "#E5B600";
	}

	public mapToViewData() {
		
			var places = _.map(this.places.places, place => {
			 var point = new Maps.PlaceMarker(place.Location.Lat, place.Location.Lng);
			 return point;
			});
			this.viewPlaces.places = places;

			var countries = _.map(this.places.countries, country => {

			 var colorConfig = new Maps.PolygonConfig();
			 var countryVisits = null;
				if (country.Dates) {
				 countryVisits = country.Dates.length;
				}

				colorConfig.fillColor = this.getColorByNumber(countryVisits);
			 
				var countryOut = new Maps.CountryHighligt();
				countryOut.countryCode = country.CountryCode3;
				countryOut.countryConfig = colorConfig;
			 
				return countryOut;

			});
			this.viewPlaces.countries = countries;

			var cities = _.map(this.places.cities, city => {
				var marker = new Maps.PlaceMarker(city.Location.Lat, city.Location.Lng);
				return marker;
			});
			this.viewPlaces.cities = cities;
	 

	}
}