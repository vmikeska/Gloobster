class PlaceSearchBox {

	public owner: Views.ViewBase;
	public config: PlaceSearchConfig;	
	public onPlaceSelected: Function;	
  
  private delayedCallback: DelayedCallback;
	private $root: any;
	private $input: any;

	private template: any;

	constructor(config: PlaceSearchConfig) {
		this.config = config;
		this.$root = $("#" + config.elementId);
		this.$input = this.$root.find("input");
		this.owner = config.owner;		

		var source = $("#placeItem-template").html();
		this.template = Handlebars.compile(source);

		this.delayedCallback = new DelayedCallback(this.$input);
		this.delayedCallback.callback = (placeName) => this.searchPlaces(placeName);
	}

	public searchPlaces(placeName: string) {	
		if (placeName.length < this.config.minCharsToSearch) {
			return;
		}

		var params = [["placeName", placeName], ["types", this.config.providers]];
		this.owner.apiGet("place", params, places => { this.fillPlacesSearchBoxHtml(places) });
	}
 
	private fillPlacesSearchBoxHtml(places) {
		this.$root.find("ul").show();
		var htmlContent = "";
		places.forEach(item => {
			htmlContent += this.getItemHtml(item);
		});

		this.$root.find("li").unbind();
		this.$root.find("ul").html(htmlContent);

		this.$root.find("li").click(clickedPlace => {
		 this.selectPlace(clickedPlace, places);			
		});
	}

	private selectPlace(clickedPlace, places) {
		var sourceId = $(clickedPlace.currentTarget).data("value");
		var sourceTypeStr = $(clickedPlace.currentTarget).data("type");
		var sourceType = parseInt(sourceTypeStr);
		var clickedPlaceObj = _.find(places, place => (place.SourceId === sourceId.toString() && place.SourceType === sourceType));

		var newPlaceRequest = {
			"SourceId": sourceId,
			"SourceType": sourceType
		};

		this.$root.find("ul").hide();

		if (this.config.clearAfterSearch) {
			this.$root.find("input").val("");
		} else {
			var selectedCaption = clickedPlaceObj.City + ", " + clickedPlaceObj.CountryCode;
			this.$root.find("input").val(selectedCaption);
		}

		this.onPlaceSelected(newPlaceRequest);
	}

	private getIconForSearch(sourceType: SourceType) {

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

	private getItemHtml(item) {

		var context = {
			sourceId: item.SourceId,
			sourceType: item.SourceType,
			icoClass: this.getIconForSearch(item.SourceType),
			name: item.Name,
			countryCode: item.CountryCode
		}

		var html = this.template(context);
		return html;
	}
}

class PlaceSearchConfig {
	owner: Views.ViewBase;
	elementId: string;
	providers: string;
	minCharsToSearch: number;
	clearAfterSearch: boolean;
}