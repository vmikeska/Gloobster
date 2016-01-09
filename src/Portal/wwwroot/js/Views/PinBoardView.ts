module Views {

	export class PinBoardView extends ViewBase {

		public mapsManager: Maps.MapsManager;
		private placeSearch: Common.PlaceSearchBox;

		private shareDialogView: ShareDialogPinsView;
		private fbPermissions: Common.FacebookPermissions;
		private currentLegend: any;
	
		get pageType(): Views.PageType { return PageType.PinBoard; }

		public initialize() {
			this.mapsManager = new Maps.MapsManager();	
			this.mapsManager.switchToView(Maps.ViewType.D2);
			this.fbPermissions = new Common.FacebookPermissions();

			this.shareDialogView = new ShareDialogPinsView();

			this.initPlaceSearch();

			$("#mapType li").click((e) => {
				var value = $(e.target).data("value");
				var parsedVal = parseInt(value);
				this.mapsManager.switchToView(parsedVal);
				this.setSupportedProjections(parsedVal);
			});

			$("#pluginType li").click(() => {
				this.refreshData(false);
			});

			$("#projectionType li").click(() => {
				this.refreshData(false);
			});

			this.setTagPlacesVisibility();
		 
		}

		

		private setSupportedProjections(mapType: number) {
			var $heatMapOpt = $("#pt2");

			if (mapType === 1) {
				$heatMapOpt.show();
			}
			if (mapType === 0) {
				$heatMapOpt.hide();
			}
		}

		private initPlaceSearch() {
		 var c = new Common.PlaceSearchConfig();
		 c.providers = "0,1,2,3";
		 c.elementId = "cities";
		 c.minCharsToSearch = 1;
		 c.clearAfterSearch = true;

		 this.placeSearch = new Common.PlaceSearchBox(c);
		 this.placeSearch.onPlaceSelected = (request) => this.saveNewPlace(request);
	  }

		private refreshData(force: boolean) {
			setTimeout(() => {
				var pluginType = parseInt($("#pluginType input").val());
				var projectionType = parseInt($("#projectionType input").val());
				this.mapsManager.getPluginData(pluginType, projectionType, force);
				this.displayLegend(projectionType);
			}, 10);
		}
	 
		private displayLegend(pluginType: Maps.DisplayEntity) {
			if (this.currentLegend) {
				this.currentLegend.hide();
				this.currentLegend = null;
			}

			if (pluginType === Maps.DisplayEntity.Countries) {
				this.currentLegend = $("#countriesLegend");
			}

			if (this.currentLegend) {
				this.currentLegend.show();
			}
		}

		public getTaggedPlacesPermissions() {
		 this.fbPermissions.requestPermissions("user_tagged_places", (resp) => {
			$("#taggedPlacesPerm").hide();
			this.apiPost("FbTaggedPlacesPermission", null, (resp) => {
			 this.refreshData(true);
			});
		 });		 
		}

		private setTagPlacesVisibility() {		 
			var hasFb = this.hasSocNetwork(Reg.NetworkType.Facebook);
			if (hasFb) {
			 this.fbPermissions.initFb(() => {
				this.fbPermissions.hasPermission("user_tagged_places", (hasPerm) => {
				 if (!hasPerm) {
					$("#taggedPlacesPerm").show();
				 } else {
					$("#taggedPlacesPerm").hide();
				 }
				});
			 });
				
			}
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