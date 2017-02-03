module Views {
		

	export class PinBoardSearch {

		public onPlaceSelected: Function;

		private baseProviders = this.provToStr([SourceType.City, SourceType.Country]);
		private socProv = [SourceType.FB, SourceType.S4, SourceType.Yelp];
		private socNetProviders = this.provToStr(this.socProv);

		private itemTmp = ViewBase.currentView.registerTemplate("place-tag-template");

		private coordinates: any;
		private lastQuery: string;
		private searchOnSoc = false;

		private $root;
		private $input;
		private $cities;
		private $countries;
		private $socials;
		private $results;
			
		private delayedCallback: Common.DelayedCallback;

		private v: PinBoardView;
			
		constructor($root, v: PinBoardView) {
			this.v = v;
			this.$root = $root;
			this.$input = $root.find("#citiesInput");
			this.$cities = $root.find("#sectCities");
			this.$countries = $root.find("#sectCountries");
			this.$socials = $root.find("#sectSocial");
			this.$results = $root.find(".place-search-results");

			this.regCallback();
			this.regSearchSoc();
		}
			
		private shouldCreateCheckin() {
			return this.$root.find("#cbCreateCheckin").prop("checked");
		}

		private regSearchSoc() {
			var $btn = this.$root.find("#socSearchBtn");

			$btn.click((e) => {
						e.preventDefault();

						this.$socials.toggleClass("hidden");

						this.searchSoc();

				this.searchOnSoc = true;

				$btn.hide();
			});

		}

		private searchSoc() {
			
			this.search(this.lastQuery, false, (places) => {

					this.fillContent(places, this.$socials, false);
				
			});
		}
			
		private getByType(places, type: SourceType) {
			return _.filter(places, (p) => { return p.SourceType === type; });
		}
			
		private regCallback() {
			this.delayedCallback = new Common.DelayedCallback(this.$input);
			this.delayedCallback.callback = (query) => {
				this.lastQuery = query;

				this.search(query, true, (places) => {
						var cities = this.getByType(places, SourceType.City);

						this.fillContent(cities, this.$cities, true);

						var countries = this.getByType(places, SourceType.Country);

						this.fillContent(countries, this.$countries, false);

						this.show(true);

						if (this.searchOnSoc) {
								this.searchSoc();
						}
				});
			};
		}

		private show(state) {
			if (state) {
				this.$results.removeClass("hidden");
			} else {
				this.$results.addClass("hidden");
			}
		}

		private fillContent(items, $section, showCC: boolean) {

				if (!any(items)) {
					$section.addClass("hidden");
				}
				
			var $cont = $section.find(".content");

				var lg = Common.ListGenerator.init($cont, "place-tag-template");
			 lg.clearCont = true;

				lg.customMapping = (item) => {
					var r = {
						id: item.SourceId,
						type: item.SourceType,
						icon: this.getIcon(item.SourceType),
						name: item.Name,
						showCC: showCC,
						cc: item.CountryCode
						};
						
					return r;
			 }

			lg.evnt(null, (e, $item, $target, item) => {					
					var req = { SourceType: item.SourceType, SourceId: item.SourceId, CheckToSoc: this.shouldCreateCheckin() };

				  this.show(false);
					this.$input.val("");
					this.v.saveNewPlace(req);
				});

				lg.generateList(items);

				if (any(items)) {
						$section.removeClass("hidden");
				}

		}







		public search(query: string, isBase: boolean, callback) {
			this.loader(true);

			if (query) {
				this.show(true);
			} else {
				this.show(false);
				this.loader(false);
				return;
			}

			var provs = isBase ? this.baseProviders : this.socNetProviders;

			var params = [["placeName", query], ["types", provs]];
			if (this.coordinates) {
				params.push(["lat", this.coordinates.lat]);
				params.push(["lng", this.coordinates.lng]);
			}

			if (ViewBase.fbt) {
				params.push(["fbt", ViewBase.fbt]);
			}

			ViewBase.currentView.apiGet("place", params, (places) => {
				callback(places);
				this.loader(false);
			});
		}

		public setCoordinates(lat, lng) {
			this.coordinates = { lat: lat, lng: lng };
		}
			
		//		countryCode: item.CountryCode

		private getIcon(sourceType: SourceType) {
			switch (sourceType) {
			case SourceType.FB:
				return "facebook2";
			case SourceType.City:
				return "city";
			case SourceType.Country:
				return "country";
			case SourceType.S4:
				return "foursquare";
			case SourceType.Yelp:
				return "yelp";
			}
			return "";
		}

		private loader(state: boolean) {
			if (state) {
				this.$root.find(".loader").show();
			} else {
				this.$root.find(".loader").hide();
			}

		}

		private provToStr(itms) {
			var res = _.map(itms, (i) => { return i.toString(); });
			return res.join();
		}
	}

	export class PinBoardView extends ViewBase {
			
			private countryLegendTmp;

			private switcher: Switcher;

			public mapsManager: Maps.MapsManager;
			private search: PinBoardSearch;

			private shareDialogView: ShareDialogPinsView;
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

					this.shareDialogView = new ShareDialogPinsView();
					
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
					
					this.search = new PinBoardSearch($(".place-search"), this);
					this.search.onPlaceSelected = (request) => this.saveNewPlace(request);
			}

			private initShareDialog() {
					var $btn = $("#share-btn");
					
					var $dialog = $(".popup-share");

					$btn.click((e) => {
							e.preventDefault();

							var hasSocNets = this.hasSocNetwork(SocialNetworkType.Facebook) || this.hasSocNetwork(SocialNetworkType.Twitter);
							if (hasSocNets) {
									$dialog.slideToggle();
							} else {
									var id = new Common.InfoDialog();
									$("#popup-joinSoc").slideToggle();
									id.create(this.t("NoSocNetTitle", "jsPins"), this.t("NoSocNetShare", "jsPins"));
							}
					});
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