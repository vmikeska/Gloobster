class PinBoardView extends Views.ViewBase {

	public mapsManager: MapsManager;

	get pageType(): Views.PageType { return Views.PageType.PinBoard; }

	public initialize() {
		this.mapsManager = new MapsManager(this);
		this.mapsManager.switchToView(Maps.ViewType.D2);
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

	public searchPlaces(placeName: string) {		
		var minChars = 3;

		if (placeName.length < minChars) {
			return;
		}

		var params = [["placeName", placeName]];
		super.apiGet("place", params, places => { this.fillPlacesSearchBoxHtml(places) });

	}


	fillPlacesSearchBoxHtml(places) {
		$("#cities ul").show();
		var htmlContent = '';
		places.forEach(item => {
			htmlContent += this.getItemHtml(item);
		});

		$("#cities li").unbind();
		$("#cities ul").html(htmlContent);

		$("#cities li").click(clickedPlace => {
			this.placeAdd(clickedPlace, places);
			$("#cities input").val("");
		});
	}

	placeAdd(clickedPlace, places) {
		var sourceId = $(clickedPlace.currentTarget).data("value");
		var sourceTypeStr = $(clickedPlace.currentTarget).data("type");
		var sourceType = parseInt(sourceTypeStr);

		var newPlaceRequest = {
			"SourceId": sourceId,
			"SourceType": sourceType
		};

		$("#cities ul").hide();

		this.saveNewPlace(newPlaceRequest);
	}

	getIconForSearch(sourceType: SourceType) {
		var link = "../images/PlaceSearch/";

		switch (sourceType) {
		case SourceType.FB:
			link += "FB.png";
			break;
		case SourceType.City:
			link += "Ci.png";
			break;
		case SourceType.Country:
			link += "Co.png";
			break;
		case SourceType.S4:
			link += "4S.png";
			break;
		}

		return link;
	}

	getItemHtml(item) {

		var imgUrl = this.getIconForSearch(item.SourceType);
		return '<li data-value="' + item.SourceId + '" data-type="' + item.SourceType + '"><span class="thumbnail"><img src="' + imgUrl + '"></span>' + item.Name + '<span class="color2">, ' + item.CountryCode + '</span></li>';
	}

}




