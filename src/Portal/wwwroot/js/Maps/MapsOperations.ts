module Maps {

		export class NMapsOperations {

				public mapsDriver: IMapsDriver;
				public countryShapes: Common.CountryShapes;
				public usShapes: Common.UsStates;

				constructor() {
						this.countryShapes = new Common.CountryShapes();
						this.usShapes = new Common.UsStates();
				}

				public setBaseMapsOperations(baseMapsOperations: IMapsDriver) {
						this.mapsDriver = baseMapsOperations;
				}

				public drawCountry(country: CountryHighligt) {

						var countryParts = this.countryShapes.getCoordinatesByCountryCode(country.countryCode);

						if (!countryParts) {
								console.log("missing country with code: " + country.countryCode);
								return;
						}
						countryParts.forEach(countryPart => {
								this.mapsDriver.drawPolygon(countryPart, country.countryConfig);
						});
				}

				public drawUsState(state: CountryHighligt) {
						var stateParts = this.usShapes.getCoordinatesByStateCode(state.countryCode);

						if (!stateParts) {
								console.log("missing state with code: " + state.countryCode);
								return;
						}

						stateParts.forEach(statePart => {
								this.mapsDriver.drawPolygon(statePart, state.countryConfig);
						});
				}

				public drawUsStates(states: CountryHighligt[]) {
						states.forEach(state => {
								this.drawUsState(state);
						});
				}

				public drawCountries(countries: CountryHighligt[]) {
						countries.forEach(country => {
								this.drawCountry(country);
						});
				}

				public drawCity(city: PlaceMarker) {
						var marker = this.mapsDriver.drawPin(city);
						this.mapsDriver.drawPopUp(marker, city);
				}

				public removeCity(gid) {
						this.mapsDriver.removePin(gid);
				}

				public drawCities(cities: PlaceMarker[]) {

						var pvm = <Views.PinBoardView>Views.ViewBase.currentView;

						var contBase = { isJustMe: pvm.peopleFilter.justMeSelected() };
						cities.forEach(city => {
								var context = $.extend(contBase, city);
								this.drawCity(context);
						});
				}

				public drawPlace(place: PlaceMarker) {
						this.mapsDriver.drawPoint(place);
				}

				public drawPlaces(places: PlaceMarker[]) {
						places.forEach(place => {
								this.drawPlace(place);
						});
				}

				public setView(lat: number, lng: number, zoom: number) {
						this.mapsDriver.setView(lat, lng, zoom);
				}
		}

	export class MapsOperations {

		public mapsDriver: IMapsDriver;
		public countryShapes: Common.CountryShapes;
	  public usShapes: Common.UsStates;

		constructor() {
			this.countryShapes = new Common.CountryShapes();
			this.usShapes = new Common.UsStates();
		}

		public setBaseMapsOperations(baseMapsOperations: IMapsDriver) {
			this.mapsDriver = baseMapsOperations;
		}

		public drawCountry(country: CountryHighligt) {

			var countryParts = this.countryShapes.getCoordinatesByCountryCode(country.countryCode);

			if (!countryParts) {
				console.log("missing country with code: " + country.countryCode);
				return;
			}
			countryParts.forEach(countryPart => {
				this.mapsDriver.drawPolygon(countryPart, country.countryConfig);
			});
		}

		public drawUsState(state: CountryHighligt) {
		 var stateParts = this.usShapes.getCoordinatesByStateCode(state.countryCode);

		 if (!stateParts) {
			console.log("missing state with code: " + state.countryCode);
			return;
		 }

		 stateParts.forEach(statePart => {
			this.mapsDriver.drawPolygon(statePart, state.countryConfig);
		 });
		}

		public drawUsStates(states: CountryHighligt[]) {
		 states.forEach(state => {
			this.drawUsState(state);
		 });
		}

		public drawCountries(countries: CountryHighligt[]) {
			countries.forEach(country => {
				this.drawCountry(country);
			});
		}
	 
		public drawCity(city: PlaceMarker) {
			var marker = this.mapsDriver.drawPin(city);
			this.mapsDriver.drawPopUp(marker, city);
		}

	  public removeCity(gid) {
		  this.mapsDriver.removePin(gid);
		}

		public drawCities(cities: PlaceMarker[]) {

			var pvm = <Views.PinBoardView> Views.ViewBase.currentView;

			var contBase = { isJustMe: pvm.peopleFilter.justMeSelected() };
			cities.forEach(city => {
				var context = $.extend(contBase, city);
				this.drawCity(context);
			});
		}

		public drawPlace(place: PlaceMarker) {
			this.mapsDriver.drawPoint(place);
		}

		public drawPlaces(places: PlaceMarker[]) {
			places.forEach(place => {
				this.drawPlace(place);
			});
		}

		public setView(lat: number, lng: number, zoom: number) {
			this.mapsDriver.setView(lat, lng, zoom);
		}
	}


}