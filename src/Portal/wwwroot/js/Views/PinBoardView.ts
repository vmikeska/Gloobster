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

	  constructor() {
		 super();
		 this.loginButtonsManager.onAfterCustom = (net) => {
			 if (net === SocialNetworkType.Facebook) {
				this.initFb();
			 }
		 }

		  this.initShareDialog();
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

	 private initShareDialog() {
		var $btn = $("#share-btn");		
		var $dialog = $("#popup-share");

		 $btn.click((e) => {
			e.preventDefault();

			var hasSocNets = this.hasSocNetwork(SocialNetworkType.Facebook) || this.hasSocNetwork(SocialNetworkType.Twitter);
			 if (hasSocNets) {
				 $dialog.toggleClass("popup-open");
				 $dialog.slideToggle();
			 } else {
				 var id = new Common.InfoDialog();				 
				 $("#popup-joinSoc").slideToggle();
				 id.create(this.t("NoSocNetTitle", "jsPins"), this.t("NoSocNetShare", "jsPins"));
			 }
		 });		
		}

		private setShareText(cities, countries) {
			//not allowed :(
		 //var $dialog = $("#popup-share");
			//var txt = this.t("InitShareText", "jsPins")
			//	.replace("{cities}", cities)
			//	.replace("{countries}", countries);
			//$dialog.find("textarea").val(txt);
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

			var id = new Common.InprogressDialog();
			id.create(this.t("ImportingCheckins", "jsPins"));
			
			this.apiPost("FbTaggedPlacesPermission", null, (r2) => {
			 this.refreshData();
			 id.remove();
			});
		 });
		}

		public initialize() {		 
			this.mapsManager = new Maps.MapsManager();
			this.mapsManager.onDataChanged = () => {
					this.pinBoardBadges.refresh();					
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
				
				var $messageCitiesVisited = $("#messageCitiesVisited");
				var $messageCountriesVisited = $("#messageCountriesVisited");
				var $messagePlaces = $("#messagePlaces");
				var $messageCitiesInterested = $("#messageCitiesInterested");
				var $messageCountriesInterested = $("#messageCountriesInterested");

				$(".infoMessage").hide();
			 
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
			var d = new Common.ConfirmDialog();
			d.create(this.t("DelDialogTitle", "jsPins"), this.t("DelDialogBody", "jsPins"), this.t("Cancel", "jsLayout"), this.t("Ok", "jsLayout"), () => {
				var prms = [["gid", gid]];
				this.apiDelete("VisitedCity", prms, (r) => {
					this.mapsManager.removeCity(r.gid, r.countryCode);

					this.refreshBadges(r.stats);
				});
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

			this.setShareText(citiesCount, countriesCount);
		}

		private refreshBadges(stats) {
			this.setStatsRibbon(stats.citiesCount, stats.countriesCount, stats.worldTraveledPercent, stats.statesCount);

			this.pinBoardBadges.cities = stats.topCities;
			this.pinBoardBadges.countries = stats.countryCodes;
			this.pinBoardBadges.states = stats.stateCodes;
			this.pinBoardBadges.refresh();
		}

		public saveNewPlace(request) {
			var self = this;
			this.apiPost("checkin", request, (req) => {

				this.refreshBadges(req);

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

					if (req.visitedStates) {
						req.visitedStates.forEach(state => {
							self.mapsManager.mapsDataLoader.places.states.push(state);
						});
					}
					
					if (req.visitedCities != null && req.visitedCities.length > 0) {
					 moveToLocation = req.visitedCities[0].Location;
					}
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
					
				self.mapsManager.mapsDataLoader.mapToViewData();
				self.mapsManager.redrawDataCallback();
			});
		}

	}

}