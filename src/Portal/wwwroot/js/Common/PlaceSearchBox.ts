module Common {
	export class PlaceSearchBox {

		public config: PlaceSearchConfig;
		public onPlaceSelected: Function;

		private delayedCallback: DelayedCallback;
		private $root: any;
		private $input: any;
		public lastText: string;

		private template: any;
		private coordinates: any;

		constructor(config: PlaceSearchConfig) {
			this.config = config;
			this.$root = $("#" + config.elementId);
			this.$input = this.$root.find("input");

			var source = $("#placeItem-template").html();
			this.template = Handlebars.compile(source);

			this.$input.focus((e) => {
				$(e.target).val("");
			});
			this.$input.focusout(() => {
				this.setText(this.lastText);
			});

			this.delayedCallback = new DelayedCallback(this.$input);
			this.delayedCallback.callback = (placeName) => {
				this.$root.find("ul").hide();

				if (placeName) {
					this.loader(true);
				}

				this.searchPlaces(placeName);
			};

		}

		private loader(state: boolean) {
			if (state) {
				this.$root.find(".loader").show();
			} else {
				this.$root.find(".loader").hide();
			}

		}

		public setText(text: string) {
			this.lastText = text;
			this.$root.find("input").val(text);
		}

		public setCoordinates(lat, lng) {
			this.coordinates = { lat: lat, lng: lng };
		}

		public searchPlaces(placeName: string) {
			if (placeName.length < this.config.minCharsToSearch) {
				return;
			}

			var params = [["placeName", placeName], ["types", this.config.providers]];
			if (this.coordinates) {
				params.push(["lat", this.coordinates.lat]);
				params.push(["lng", this.coordinates.lng]);
			}

			if (Views.ViewBase.fbt) {
				params.push(["fbt", Views.ViewBase.fbt]);
			}

			Views.ViewBase.currentView.apiGet("place", params, places => {				
			 this.fillPlacesSearchBoxHtml(places);
			 this.loader(false);
			});
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
				this.setText("");
			} else {
				var selectedCaption = this.getCaption(clickedPlaceObj);
				if (this.config.customSelectedFormat) {
					selectedCaption = this.config.customSelectedFormat(clickedPlaceObj);
				}
				this.setText(selectedCaption);
			}

			this.onPlaceSelected(newPlaceRequest, clickedPlaceObj);
		}

		private getCaption(place) {
			var name = "";

			var isSocNetworkPlace = (place.SourceType === SourceType.FB) || (place.SourceType === SourceType.S4);
			if (isSocNetworkPlace) {
				name = `${place.Name}, ${place.City}`;
			}

			if (place.SourceType === SourceType.Country) {
				name = place.Name;
			}

			if (place.SourceType === SourceType.City) {
				name = place.City + ", " + place.CountryCode;
			}

			return name;
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
			case SourceType.Yelp:
			 return "icon-yelp";
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

	export class PlaceSearchConfig {
		elementId: string;
		providers: string;
		minCharsToSearch: number;
		clearAfterSearch: boolean;
		customSelectedFormat: Function;
	}
}