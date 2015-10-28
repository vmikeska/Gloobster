class PinBoardView extends Views.ViewBase {

	public mapsManager: MapsManager;
  private placeSearch: PlaceSearchBox;

	get pageType(): Views.PageType { return Views.PageType.PinBoard; }

	public initialize() {
		this.mapsManager = new MapsManager(this);
		this.mapsManager.switchToView(Maps.ViewType.D2);

		var searchConfig = new PlaceSearchConfig();
		searchConfig.owner = this;
		searchConfig.providers = "0,1,2,3";
		searchConfig.elementId = "cities";
		searchConfig.minCharsToSearch = 3;
		searchConfig.clearAfterSearch = true;

		this.placeSearch = new PlaceSearchBox(searchConfig);
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

