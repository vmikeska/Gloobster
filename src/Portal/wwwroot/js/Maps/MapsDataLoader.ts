module Maps {
	export class MapsDataLoader {
		public places: Places;
		public viewPlaces: PlacesDisplay;

		public dataLoadedCallback: Function;

		public getPluginData(dataType: DataType, displayEntity: DisplayEntity, people: PeopleSelection) {

		 var request = [
			["dataType", dataType.toString()],
			["displayEntity", displayEntity.toString()],
			["me", people.me.toString()],
			["friends", people.friends.toString()],
			["everybody", people.everybody.toString()],
			["singleFriends", people.singleFriends.join()]
		 ];
		 
			Views.ViewBase.currentView.apiGet("PinBoardStats", request, response => {			 
				this.places = new Places();
				this.viewPlaces = new PlacesDisplay();

				this.places.places = response.visitedPlaces;
				this.places.cities = response.visitedCities;
				this.places.countries = response.visitedCountries;

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
			 var point = new PlaceMarker();
			 point.lat = place.Location.Lat;
			 point.lng = place.Location.Lng;
				return point;
			});
			this.viewPlaces.places = places;

			var countries = _.map(this.places.countries, country => {

				var colorConfig = new PolygonConfig();
			
				colorConfig.fillColor = this.getColorByNumber(country.Count);
				colorConfig.countryCode = country.CountryCode2;

				var countryOut = new CountryHighligt();
				countryOut.countryCode = country.CountryCode2;
				countryOut.countryConfig = colorConfig;

				return countryOut;

			});
			this.viewPlaces.countries = countries;

			var cities = _.map(this.places.cities, city => {
				var marker = new PlaceMarker();
				marker.city = city.City;
				marker.dates = city.Dates;
				marker.lat = city.Location.Lat;
				marker.lng = city.Location.Lng;
				marker.geoNamesId = city.GeoNamesId;
				return marker;
			});
			this.viewPlaces.cities = cities;


		}
	}
}