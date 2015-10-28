class PinBoardView extends Views.ViewBase {

	public mapsManager: MapsManager;
  private placeSearch: PlaceSearchBox;

	get pageType(): Views.PageType { return Views.PageType.PinBoard; }

	public initialize() {
		this.mapsManager = new MapsManager(this);
		this.mapsManager.switchToView(Maps.ViewType.D2);

		this.placeSearch = new PlaceSearchBox(this, "cities", "0,1,2,3");
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

class PlaceSearchBox {

	public owner: Views.ViewBase;
	public providers: string;
	public onPlaceSelected: Function;

	constructor(owner: Views.ViewBase, elementId: string, providers: string) {
		this.owner = owner;
		this.registerHandler(elementId);
		this.providers = providers;
	}

	public searchPlaces(placeName: string) {
		var minChars = 3;

		if (placeName.length < minChars) {
			return;
		}

		var params = [["placeName", placeName], ["types", this.providers]];
		this.owner.apiGet("place", params, places => { this.fillPlacesSearchBoxHtml(places) });

	}

	private registerHandler(elementId: string) {
		//var elemId = "#" + elementId;
		//$(elemId).on("input", () => {
		//	var placeName = $(elemId + " input").val();

		//	this.searchPlaces(placeName);
		//});

	 var $elem = $("#" + elementId);
	 $elem.on("input", () => {
		var placeName = $elem.find("input").val();

			this.searchPlaces(placeName);
		});


	}

	private fillPlacesSearchBoxHtml(places) {
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

	private placeAdd(clickedPlace, places) {
		var sourceId = $(clickedPlace.currentTarget).data("value");
		var sourceTypeStr = $(clickedPlace.currentTarget).data("type");
		var sourceType = parseInt(sourceTypeStr);

		var newPlaceRequest = {
			"SourceId": sourceId,
			"SourceType": sourceType
		};

		$("#cities ul").hide();

		this.onPlaceSelected(newPlaceRequest);

		//this.saveNewPlace(newPlaceRequest);
	}

	getIconForSearch(sourceType: SourceType) {

		switch (sourceType) {
		case SourceType.FB:
			return "icon-facebook";
		case SourceType.City:
			return "icon-city";
		case SourceType.Country:
			return "icon-country";
		case SourceType.S4:
			return "icon-foursquare";
		}

		return "";
	}

	getItemHtml(item) {

		var icoClass = this.getIconForSearch(item.SourceType);

		return '<li data-value="' + item.SourceId + '" data-type="' + item.SourceType + '"><span class="' + icoClass + ' left mright10"></span>' + item.Name + '<span class="color2">, ' + item.CountryCode + '</span></li>';
	}
}




