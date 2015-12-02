module Views {
	export class PinBoardView extends ViewBase {

		public mapsManager: Maps.MapsManager;
		private placeSearch: Common.PlaceSearchBox;

		get pageType(): Views.PageType { return Views.PageType.PinBoard; }

		public initialize() {
			this.mapsManager = new Maps.MapsManager();
			this.mapsManager.switchToView(Maps.ViewType.D2);

			var c = new Common.PlaceSearchConfig();
			c.providers = "0,1,2,3";
			c.elementId = "cities";
			c.minCharsToSearch = 1;
			c.clearAfterSearch = true;

			this.placeSearch = new Common.PlaceSearchBox(c);
			this.placeSearch.onPlaceSelected = (request) => this.saveNewPlace(request);
		}

		public saveNewPlace(request) {
			var self = this;
			super.apiPost("checkin", request, places => {

				var moveToLocation = null;

				if (places.VisitedCities) {
					places.VisitedCities.forEach(city => {
						self.mapsManager.mapsDataLoader.places.cities.push(city);
						moveToLocation = city.Location;
					});
				}

				if (places.VisitedPlaces) {
					places.VisitedPlaces.forEach(place => {
						self.mapsManager.mapsDataLoader.places.places.push(place);
						moveToLocation = place.Location;
					});
				}

				if (places.VisitedCountries) {
					places.VisitedCountries.forEach(country => {
						self.mapsManager.mapsDataLoader.places.countries.push(country);
					});
				}

				if (moveToLocation) {
					self.mapsManager.mapsDriver.moveToAnimated(moveToLocation.Lat, moveToLocation.Lng, 5);
				}

				self.mapsManager.mapsDataLoader.mapToViewData();
				self.mapsManager.redrawDataCallback();
			});
		}

	}

}