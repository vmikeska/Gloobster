module Views {
	export class PinBoardView extends ViewBase {

		public mapsManager: Maps.MapsManager;
		private placeSearch: Common.PlaceSearchBox;

		private shareDialogView: ShareDialogPinsView;
		private fbPermissions: Common.FacebookPermissions;
		private currentLegend: any;
		public peopleFilter: PeopleFilter;

		private pinBoardBadges: PinBoardBadges;

		get pageType(): Views.PageType { return PageType.PinBoard; }

		public initialize() {
			this.mapsManager = new Maps.MapsManager();
			this.mapsManager.onDataChanged = () => {
				this.pinBoardBadges.refresh(this.mapsManager.currentDisplayEntity);
				$("#TopCitiesCount").text(this.pinBoardBadges.visitedTotal);
			};
			this.mapsManager.switchToView(Maps.ViewType.D2);
			this.fbPermissions = new Common.FacebookPermissions();
			this.pinBoardBadges = new PinBoardBadges();

			this.shareDialogView = new ShareDialogPinsView();

			this.initPlaceSearch();

			$("#mapType li").click((e) => {
				var value = $(e.target).data("value");
				var parsedVal = parseInt(value);
				this.mapsManager.switchToView(parsedVal);
				this.setSupportedProjections(parsedVal);
			});

			$("#pluginType li").click(() => {
				this.refreshData();
			});

			$("#projectionType li").click(() => {
				this.refreshData();
			});

			this.setTagPlacesVisibility();

			this.peopleFilter = new PeopleFilter();
			this.peopleFilter.onSelectionChanged = (selection) => {
				this.refreshData();
			};
		}

		public deletePin(gid) {
			var prms = [["gid", gid]];
			this.apiDelete("VisitedCity", prms, (r) => {
				this.mapsManager.removeCity(r.gid, r.countryCode);
			});
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

		private refreshData() {
			setTimeout(() => {
				var dataType = parseInt($("#dataType input").val());
				var projectionType = parseInt($("#projectionType input").val());
				var people = this.peopleFilter.getSelection();
				this.mapsManager.getPluginData(dataType, projectionType, people);
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
					this.refreshData();
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

		private setStatsRibbon(citiesCount: number, countriesCount: number, worldTraveledPercent: number, statesCount: number) {
			$("#CitiesCount").text(citiesCount);
			$("#CountriesCount").text(countriesCount);
			$("#TraveledPercent").text(worldTraveledPercent);
			$("#StatesCount").text(statesCount);
		}

		public saveNewPlace(request) {
			var self = this;
			this.apiPost("checkin", request, (req) => {

				var moveToLocation = null;

				if (this.mapsManager.currentDisplayEntity === Maps.DisplayEntity.Pin) {
					req.visitedCities.forEach(city => {
						self.mapsManager.mapsDataLoader.places.cities.push(city);
						moveToLocation = city.Location;
					});
				}

				if (this.mapsManager.currentDisplayEntity === Maps.DisplayEntity.Countries) {
					req.visitedCountries.forEach(country => {
						self.mapsManager.mapsDataLoader.places.countries.push(country);
					});

					req.visitedStates.forEach(state => {
						self.mapsManager.mapsDataLoader.places.states.push(state);
					});
				}

				if (this.mapsManager.currentDisplayEntity === Maps.DisplayEntity.Heat) {
					req.visitedPlaces.forEach(place => {
						self.mapsManager.mapsDataLoader.places.places.push(place);
						moveToLocation = place.Location;
					});
				}

				if (moveToLocation) {
					self.mapsManager.mapsDriver.moveToAnimated(moveToLocation.Lat, moveToLocation.Lng, 5);
				}

				this.setStatsRibbon(req.citiesCount, req.countriesCount, req.worldTraveledPercent, req.statesCount);

				self.mapsManager.mapsDataLoader.mapToViewData();
				self.mapsManager.redrawDataCallback();
			});
		}

	}

}