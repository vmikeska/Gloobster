class PinBoardView extends Views.ViewBase {
 
		public mapsManager: MapsManager;
	 
		get pageType(): Views.PageType { return Views.PageType.PinBoard; }

		public initialize() {
			this.mapsManager = new MapsManager(this);
			this.mapsManager.switchToView(Maps.ViewType.D2);
		}
	
		public saveNewPlace(dataRecord) {
			//todo: rework
		 //var self = this;
			//super.apiPost("visitedPlace", dataRecord, function(response) {

			//	var placeAdded = response.length > 0;
			//	if (placeAdded) {
			//	 var place = response[0];
			//	 var newMarker = new Maps.PlaceMarker(place.PlaceLatitude, place.PlaceLongitude);
			//	 self.mapsManager.places.push(newMarker);
			//	 self.mapsManager.mapsOperations.drawPlace(newMarker); 
			//	}
			 
			//	self.mapsManager.mapsDriver.moveToAnimated(dataRecord.PlaceLatitude, dataRecord.PlaceLongitude, 5);
			//});
		}

		public searchPlaces(placeName: string) {
			//var self = this;
			var minChars = 3;

			if (placeName.length < minChars) {
				return;
			}

			var params = [["placeName", placeName]];
			super.apiGet("place", params, response => {

				$("#cities ul").show();
				var htmlContent = '';
				response.forEach(item => {
					htmlContent += this.getItemHtml(item);
				});

				$("#cities ul").html(htmlContent);

				$("#cities li").unbind();
				$("#cities li").click(item => {
					var geoId = $(item.currentTarget).data("value");

					var dataRecord = _.find(response, { "SourceId": geoId.toString() });

					var newPlaceRequest = {
						"CountryCode": dataRecord.CountryCode,
						"City": dataRecord.City,						
						"SourceId": dataRecord.SourceId,
						"SourceType": dataRecord.SourceType
					};

				 if (dataRecord.Coordinates) {
					newPlaceRequest["PlaceLatitude"] = dataRecord.Coordinates.Lat;
					newPlaceRequest["PlaceLongitude"] = dataRecord.Coordinates.Lng;
				 }
					
					$("#cities ul").hide();

					this.saveNewPlace(newPlaceRequest);
				});

			});
		}
	 
		getItemHtml(item) {

			var imgUrl = 'images/samples/sample11.png';
		 return '<li data-value="' + item.SourceId + '" data-type="' + item.SourceType + '"><span class="thumbnail"><img src="'+ imgUrl + '"></span>' + item.Name + '<span class="color2">, ' + item.CountryCode + '</span></li>';
		 //'<div class="cityMenuItem" data-id="' + item.SourceId + '" data-type="' + item.SourceType + '">' + item.Name + ', ' + item.CountryCode + ' (pop: ' + item.population + ')' + '</div>';
		}
  		
	}




