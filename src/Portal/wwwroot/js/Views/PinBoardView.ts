module Views {
		
	export class PinBoardView extends ViewBase {
			
			private countryLegendTmp;

			private switcher: Switcher;

			public mapsManager: Maps.MapsManager;
			private search: Common.AllPlacesSearch;

			private shareDialogView: ShareDialogPins;
			private fbPermissions: Common.FacebookPermissions;
			private $currentLegend: any;
			public peopleFilter: PeopleFilter;

			private currentMapType = 0;

			private pinBoardBadges: PinBoardBadges;

			get pageType(): PageType { return PageType.PinBoard; }

			constructor() {
					super();
					
					this.countryLegendTmp = this.registerTemplate("legend-template");

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

											this.checkNewPlaces();
									} else {
											this.initFbPermRequest();
									}
							});
					});
			}

			private checkNewPlaces() {
					var prms = [];
					this.apiGet("NewPlaces", prms, (any) => {
							if (any) {
									this.refreshData();

									this.apiGet("PinStats", [], (stats) => {
											this.refreshBadges(stats);
									});
							}
					});
			}
				
			private setShareText(cities, countries) {
					//not allowed by FB :(
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
							id.create(this.t("ImportingCheckins", "jsPins"), $("#map"));

							this.apiPost("FbTaggedPlacesPermission", null, (r2) => {
									this.refreshData();
									id.remove();
							});
					});
			}

			public initialize() {

					var os = Views.ViewBase.getMobileOS();
					var isComputer = os !== OS.Other;
					if (isComputer) {
							$("#mapType").addClass("hidden");
					}

					this.switcher = new Switcher();
					this.switcher.onChange = (group, val) => { this.viewChanged(group, val); };
					this.switcher.init();

					this.peopleFilter = new PeopleFilter();
					this.peopleFilter.onChange = () => {
							this.refreshData();
					};
					this.peopleFilter.init();

					this.mapsManager = new Maps.MapsManager();
					this.mapsManager.onDataChanged = () => {
							this.pinBoardBadges.refresh();
					};

					this.initMapType();
					this.initPlaceSearch();
					this.initShareDialog();

					this.switchMapType(Maps.DataType.Cities, Maps.MapType.D2);

					this.pinBoardBadges = new PinBoardBadges();
					
					this.mapsManager.onCenterChanged = (center) => {
							this.search.setCoordinates(center.lat, center.lng);
					}

					
			}

			private switchMapType(dataType, mapType) {
					
					this.mapsManager.switchToView(mapType, dataType, () => {
						this.refreshData();
					});
		  }

			private viewChanged(group, val) {
					this.refreshData();
					//this.setMenuControls();					
			}


			private initMapType() {
				var $combo = $("#mapType");
				var $input = $combo.find("input");

				$input.val(this.currentMapType);
					
				$input.change((e) => {
					this.currentMapType = parseInt($input.val());

					this.getFormState((dataType, mapType) => {
						this.switchMapType(dataType, mapType);
					});
					this.setMenuControls();
				});
			}

			private initPlaceSearch() {
					
					this.search = new Common.AllPlacesSearch($(".place-search"), this);
					this.search.onPlaceSelected = (request) => this.saveNewPlace(request);
			}

			private initShareDialog() {
					var $btn = $("#share-btn");
					
					$btn.click((e) => {
							e.preventDefault();

							var hasSocNets = this.hasSocNetwork(SocialNetworkType.Facebook) || this.hasSocNetwork(SocialNetworkType.Twitter);
							if (hasSocNets) {									
									this.showShareDialog();
							} else {
									var id = new Common.InfoDialog();
									$("#popup-joinSoc").slideToggle();
									id.create(this.t("NoSocNetTitle", "jsPins"), this.t("NoSocNetShare", "jsPins"));
							}
					});
			}

			private showShareDialog() {				
				this.shareDialogView = new ShareDialogPins();					
			}
				
			private getFormState(callback) {					
				var dataType = this.switcher.getGroupVal("data-type");
							
				callback(dataType, this.currentMapType);					
			}

			private setMenuControls() {
					this.getFormState((dataType, mapType) => {							
							var $placesIco = $(".icon-places").closest(".ico_all");

							$placesIco.show();

							if (mapType === Maps.MapType.D3) {
									$placesIco.hide();

									if (dataType === Maps.DataType.Places) {
										this.switcher.setGroupVal("data-type", 1);										
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
			
			private refreshData() {
					this.getFormState((dataType, mapType) => {
							var people = this.peopleFilter.getSelection();
							this.mapsManager.getPluginData(dataType, people);
							this.displayLegend(dataType);
					});
			}

			private displayLegend(pluginType: Maps.DataType) {
				if (this.$currentLegend) {
					this.$currentLegend.remove();
				}

				if (pluginType === Maps.DataType.Countries) {
							var $l = $(this.countryLegendTmp());
							$(".map-wrap").append($l);

							this.$currentLegend = $l;
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

							if (this.mapsManager.currentDataType === Maps.DataType.Cities) {
									req.visitedCities.forEach(city => {
											self.mapsManager.mapsDataLoader.places.cities.push(city);
											moveToLocation = city.Location;
									});
							}

							if (this.mapsManager.currentDataType === Maps.DataType.Countries) {
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

							if (this.mapsManager.currentDataType === Maps.DataType.Places) {
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