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

			this.executePlugin(pluginType);

			this.dataLoadedCallback();
		});
	}

	private executePlugin(pluginType: Maps.PluginType) {
		
		if (pluginType === Maps.PluginType.MyPlacesVisited) {

			var singleColorConfig = new Maps.PolygonConfig();
			singleColorConfig.fillColor = "#009900";

			var countries = _.map(this.places.countries, country => {

				var countryOut = new Maps.CountryHighligt();
				countryOut.countryCode = country.CountryCode3;
				countryOut.countryConfig = singleColorConfig;
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
}