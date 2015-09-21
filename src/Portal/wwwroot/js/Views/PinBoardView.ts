﻿



	class PinBoardView extends Views.ViewBase {

		public visitedCountries: any;
		public visitedPlaces: any;
	 
		public mapsManager: MapsManager;
	 
		public initialize() {
			this.mapsManager = new MapsManager();
			this.mapsManager.switchToView(Maps.ViewType.D2);		 
			this.getVisitedCountries();
			this.getVisitedPlaces();
		}
	 
		get countryConfig(): Maps.PolygonConfig {
			var countryConfig = new Maps.PolygonConfig();
			countryConfig.fillColor = "#009900";

			return countryConfig;
		}
	 
		private onVisitedCountriesResponse(visitedCountries) {
			this.visitedCountries = visitedCountries;

			var countryConf = this.countryConfig;

			var mappedCountries = _.map(this.visitedCountries, countryCode => {
				var country = new Maps.CountryHighligt();
				country.countryCode = countryCode;
				country.countryConfig = countryConf;
				return country;
			});

			this.mapsManager.setVisitedCountries(mappedCountries);
		}

		private onVisitedPlacesResponse(response) {
			this.visitedPlaces = response.Places;

			var mappedPlaces = _.map(this.visitedPlaces, place => {
			 var marker = new Maps.PlaceMarker(place.PlaceLatitude, place.PlaceLongitude);
			 return marker;
			});

			this.mapsManager.setVisitedPlaces(mappedPlaces);
		}

		public saveNewPlace(dataRecord) {
			var self = this;
			super.apiPost("visitedPlace", dataRecord, function(response) {

				var placeAdded = response.length > 0;
				if (placeAdded) {
				 var place = response[0];
				 var newMarker = new Maps.PlaceMarker(place.PlaceLatitude, place.PlaceLongitude);
				 self.mapsManager.places.push(newMarker);
				 self.mapsManager.mapsOperations.drawPlace(newMarker); 
				}
			 
				self.mapsManager.mapsDriver.moveToAnimated(dataRecord.PlaceLatitude, dataRecord.PlaceLongitude, 5);
			});
		}

		public searchPlaces(placeName: string) {
			var minChars = 3;

			if (placeName.length < minChars) {
				return;
			}

			var params = [["placeName", placeName]];
			var self = this;
			super.apiGet("place", params, function(response) {

				$("#countriesResult").show();
				var htmlContent = '';
				response.forEach(function(item) {
					htmlContent += self.getItemHtml(item);
				});

				$("#countriesResult").html(htmlContent);

				$(".cityMenuItem").unbind();
				$(".cityMenuItem").click(function(item) {
					var geoId = $(item.currentTarget).data('id');

					var dataRecord = _.find(response, { 'geonameId': geoId });

					var newPlaceRequest = {
						"CountryCode": dataRecord.countryCode,
						"City": dataRecord.name,
						"PlaceLatitude": dataRecord.lat,
						"PlaceLongitude": dataRecord.lng,
						"SourceId": dataRecord.geonameId,
						"SourceType": "GeoNames"
					};

					$("#countriesResult").hide();

					self.saveNewPlace(newPlaceRequest);
				});

			});
		}
	 
		getItemHtml(item) {
		 return '<div class="cityMenuItem" data-id="' + item.SourceId + '" data-type="' + item.SourceType + '">' + item.Name + ', ' + item.CountryCode + ' (pop: ' + item.population + ')' + '</div>';
		}

		public getVisitedPlaces() {
			var self = this;
			super.apiGet("visitedPlace", null, function(response) {
				self.onVisitedPlacesResponse(response);
			});
		}

		public getVisitedCountries() {
		 var self = this;
		 //[["userId", this.getUserId()]]
			super.apiGet("visitedCountry", null, function(response) {
				self.onVisitedCountriesResponse(response.Countries3);
			});
		}

	}




