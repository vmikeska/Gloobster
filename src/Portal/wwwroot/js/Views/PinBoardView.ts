module Views {
	export class PinBoardView extends ViewBase {

		public mapsManager: Maps.MapsManager;
		private placeSearch: Common.PlaceSearchBox;

		get pageType(): Views.PageType { return PageType.PinBoard; }

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

			$("#mapType li").click((e) => {
			 var value = $(e.target).data("value");
			 var parsedVal = parseInt(value);
			 this.mapsManager.switchToView(parsedVal);
			});

			$("#pluginType li").click((e) => {
			 var pluginType = $(e.target).data("value");
			 var projectionType = parseInt($("#projectionType input").val());
			 this.mapsManager.getPluginData(pluginType, projectionType);
			});

			$("#projectionType li").click((e) => {
			 var pluginType = parseInt($("#pluginType input").val());
			 var projectionType = $(e.target).data("value");
			 this.mapsManager.getPluginData(pluginType, projectionType);
			});
		}

		private setStatsRibbon(citiesCount: number, countriesCount: number, worldTraveledPercent: number) {
		 $("#CitiesCount").text(citiesCount);
		 $("#CountriesCount").text(countriesCount);
		 $("#TraveledPercent").text(worldTraveledPercent);
		 //DistanceLength
		 //FriendsCount
		 //BadgesCount		 
		}
	 
		public saveNewPlace(request) {
			var self = this;
			this.apiPost("checkin", request, (req) => {

				var moveToLocation = null;

				if (req.visitedCities) {
				 req.visitedCities.forEach(city => {
						self.mapsManager.mapsDataLoader.places.cities.push(city);
						moveToLocation = city.Location;
					});
				}

				if (req.visitedPlaces) {
				 req.visitedPlaces.forEach(place => {
						self.mapsManager.mapsDataLoader.places.places.push(place);
						moveToLocation = place.Location;
					});
				}

				if (req.visitedCountries) {
				 req.visitedCountries.forEach(country => {
						self.mapsManager.mapsDataLoader.places.countries.push(country);
					});
				}

				if (moveToLocation) {
					self.mapsManager.mapsDriver.moveToAnimated(moveToLocation.Lat, moveToLocation.Lng, 5);
				}

				this.setStatsRibbon(req.citiesCount, req.countriesCount, req.worldTraveledPercent);

				self.mapsManager.mapsDataLoader.mapToViewData();
				self.mapsManager.redrawDataCallback();
			});
		}

	}

}