﻿module Views {
	export class PinBoardView extends ViewBase {

	 public mapsManager: Maps.MapsManager;	 
		private placeSearch: Common.PlaceSearchBox;

		private shareDialogView: ShareDialogPinsView;
		private fbPermissions: Common.FacebookPermissions;
		private currentLegend: any;
		public peopleFilter: PeopleFilter;
	
		private pinBoardBadges: PinBoardBadges;

		get pageType(): Views.PageType { return PageType.PinBoard; }

	  constructor() {
		 super();
		 this.loginButtonsManager.onAfterCustom = (net) => {
			 if (net === SocialNetworkType.Facebook) {
				this.initFb();
			 }
		 }		 
	  }

		public initFb() {
			this.fbPermissions = new Common.FacebookPermissions();
			this.fbPermissions.initFb(() => {
				this.fbPermissions.hasPermission("user_tagged_places", (hasPermissions) => {
					if (hasPermissions) {
						this.refreshData();
					} else {
						this.initFbPermRequest();
					}
				});
			});
		}

		private initFbPermRequest() {
		 $("#taggedPlacesPerm").show();
		 $("#fbBtnImport").click((e) => {
			e.preventDefault();
			this.getTaggedPlacesPermissions();
		 });
		}

		public getTaggedPlacesPermissions() {
		 this.fbPermissions.requestPermissions("user_tagged_places", (r1) => {
			$("#taggedPlacesPerm").remove();
			$("#importingCheckins").show();
			this.apiPost("FbTaggedPlacesPermission", null, (r2) => {
			 this.refreshData();
			 $("#importingCheckins").hide();
			});
		 });
		}

		public initialize() {		 
			this.mapsManager = new Maps.MapsManager();
			this.mapsManager.onDataChanged = () => {
				this.pinBoardBadges.refresh();
				$("#TopCitiesCount").text(this.pinBoardBadges.visitedTotal);
			};
			this.mapsManager.switchToView(Maps.ViewType.D2, Maps.DisplayEntity.Pin);
			
			this.pinBoardBadges = new PinBoardBadges();

			this.shareDialogView = new ShareDialogPinsView();

			this.initPlaceSearch();

			this.initCombos();
		 
			this.setInfo();

			this.onLogin = () => {
				this.setInfo();
			}

			this.mapsManager.onCenterChanged = (center) => {
				this.placeSearch.setCoordinates(center.lat, center.lng);
			}		 
		}

		private initCombos() {
			$("#mapType input").change((e) => {
				var value = $(e.target).val();
			
				this.getFormState((dataType, entity, mapType) => {
					this.mapsManager.switchToView(mapType, entity);
				});
				this.setMenuControls();
				this.setInfo();
			});

			$("#dataType input").change(() => {
				this.refreshData();
				this.setMenuControls();
				this.setInfo();
			});

			$("#projectionType input").change(() => {
				this.refreshData();
				this.setMenuControls();
				this.setInfo();
			});

			this.peopleFilter = new PeopleFilter();
			this.peopleFilter.onSelectionChanged = (selection) => {
				this.refreshData();
			};
		}

		private setInfo() {
			this.getFormState((dataType, entity, mapType) => {
				//var userLogged = this.loginManager.isAlreadyLogged();

				//var $messageNotLogged = $("#messageNotLogged");
				var $messageCitiesVisited = $("#messageCitiesVisited");
				var $messageCountriesVisited = $("#messageCountriesVisited");
				var $messagePlaces = $("#messagePlaces");
				var $messageCitiesInterested = $("#messageCitiesInterested");
				var $messageCountriesInterested = $("#messageCountriesInterested");

				$(".infoMessage").hide();

				//if (!userLogged) {
				//$messageNotLogged.show();
				// return;
				//}

				if (dataType === Maps.DataType.Visited) {
					if (entity === Maps.DisplayEntity.Pin) {
						$messageCitiesVisited.show();
					}
					if (entity === Maps.DisplayEntity.Countries) {
						$messageCountriesVisited.show();
					}
					if (entity === Maps.DisplayEntity.Heat) {
						$messagePlaces.show();
					}
				}

				if (dataType === Maps.DataType.Interested) {
					if (entity === Maps.DisplayEntity.Pin) {
						$messageCitiesInterested.show();
					}
					if (entity === Maps.DisplayEntity.Countries) {
						$messageCountriesInterested.show();
					}
				}

			});
		}

		private getFormState(callback) {
			setTimeout(() => {
				var dataType = parseInt($("#dataType input").val());
				var entity = parseInt($("#projectionType input").val());
				var mapType = parseInt($("#mapType input").val());
				callback(dataType, entity, mapType);
			}, 10);
		}

		private setMenuControls() {
		 this.getFormState((dataType, entity, mapType) => {			
				var $city = $("#pt0");
				var $country = $("#pt1");
				var $place = $("#pt2");

				var $visited = $("#dt0");
				var $interested = $("#dt1");
			 
				$city.show();
				$country.show();
				$place.show();
				$visited.show();
				$interested.show();

				if (mapType === Maps.ViewType.D3) {
				 $place.hide();

				 if (entity === Maps.DisplayEntity.Heat) {
					$("#projectionType input").val(1);
					$("#projectionType span").text($country.text());
					this.refreshData();
				 }
				}

				if (dataType === Maps.DataType.Interested) {
				 $place.hide();

				 if (entity === Maps.DisplayEntity.Heat) {
					$("#projectionType input").val(1);
					$("#projectionType span").text($country.text());
					 this.refreshData();
				 }
				 
				}			 			 
			});
		}

		public deletePin(gid) {
			var prms = [["gid", gid]];
			this.apiDelete("VisitedCity", prms, (r) => {
				this.mapsManager.removeCity(r.gid, r.countryCode);
			});
		}

		private initPlaceSearch() {
			var c = new Common.PlaceSearchConfig();
			c.providers = "0,1,2,3,4";
			c.elementId = "cities";
			c.minCharsToSearch = 1;
			c.clearAfterSearch = true;

			this.placeSearch = new Common.PlaceSearchBox(c);
			this.placeSearch.onPlaceSelected = (request) => this.saveNewPlace(request);
		}

		private refreshData() {
		 this.getFormState((dataType, entity, mapType) => {					
				var people = this.peopleFilter.getSelection();
				this.mapsManager.getPluginData(dataType, entity, people);
				this.displayLegend(entity);
			});
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
	 
		private setStatsRibbon(citiesCount: number, countriesCount: number, worldTraveledPercent: number, statesCount: number) {
			$("#CitiesCount").text(citiesCount);
			$("#CountriesCount").text(countriesCount);
			$("#TraveledPercent").text(worldTraveledPercent);
			$("#StatesCount").text(statesCount);
		}

		public saveNewPlace(request) {
			var self = this;
			this.apiPost("checkin", request, (req) => {

				this.pinBoardBadges.cities = req.topCities;
				this.pinBoardBadges.countries = req.countryCodes;
				this.pinBoardBadges.states = req.stateCodes;
			  this.pinBoardBadges.refresh();

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