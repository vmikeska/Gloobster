module Views {

	export class PinBoardSearch {

		public onPlaceSelected: Function;

		private baseProviders = this.provToStr([SourceType.City, SourceType.Country]);
		private socProv = [SourceType.FB, SourceType.S4, SourceType.Yelp];
		private socNetProviders = this.provToStr(this.socProv);

		private template = ViewBase.currentView.registerTemplate("placeItem-template");

		private coordinates: any;
		private lastQuery: string;

		private $root;
		private $input;
		private $ulCity;
		private $ulCountry;
		private $results;


		private delayedCallback: Common.DelayedCallback;


		constructor($root) {
			this.$root = $root;
			this.$input = $root.find("input");
			this.$ulCity = $root.find(".ul-city");
			this.$ulCountry = $root.find(".ul-country");
			this.$results = $root.find(".results");

			this.regCallback();
			this.regSearchSoc();
		}

		private show(show) {
			if (show) {
				this.$results.show();
			} else {
				this.$results.hide();
			}
		}

			
		private socNetsActive = false;

		private regSearchSoc() {
			this.$root.find(".search-soc").click((e) => {
				e.preventDefault();

				this.socNetsActive = !this.socNetsActive;
				var $nets = $(".soc-nets");
				$nets.empty();

				if (this.socNetsActive) {
					this.searchSoc();
				}

			});

		}

		private searchSoc() {
			var $nets = $(".soc-nets");
			
			this.search(this.lastQuery, false, (places) => {
				$nets.empty();
				for (var act = 1; act <= this.socProv.length; act++) {
					var type = this.socProv[act - 1];
					var plcs = this.getByType(places, type);
					var $box = this.getBox(act);
					$nets.append($box);

					this.fill(plcs, $box.find("ul"));
				}

			});
		}

		private cityTemp(item) {
				return `<li data-value="${item.sourceId}" data-type="${item.sourceType}"> <span class="${item.icoClass} left mright10"> </span><a href="#">${item.name}</a><span class="color2">, ${item.countryCode}</span> </li>`;
		}

		private countryTemp(item) {
				return `<li data-value="${item.sourceId}" data-type="${item.sourceType}"> <span class="${item.icoClass} left mright10"> </span><a href="#">${item.name}</a></li>`;
		}

		private socTemp(item) {
				return `<li data-value="${item.sourceId}" data-type="${item.sourceType}"> <span class="${item.icoClass} left mright10"> </span><a href="#">${item.name}</a></li>`;
		}

		private getBox(num) {
			return $(`<div class="soc-item"><ul class="${num}"></ul></div>`);
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
						this.fill(cities, this.$ulCity);
						var countries = this.getByType(places, SourceType.Country);
						this.fill(countries, this.$ulCountry);

						if (this.socNetsActive) {
								this.searchSoc();
						}
				});
			};
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

		private fill(places, $ul) {

			var htmlContent = "";
			places.forEach(item => {
				htmlContent += this.getItemHtml(item);
			});

			$ul.html(htmlContent);

			$ul.find("a").click((e) => this.itemClick(e));				
		}

		private itemClick(e) {
			e.preventDefault();
			var $a = $(e.target);
			var $li = $a.closest("li");

			var sourceId = $li.data("value");
			var sourceType = $li.data("type");
			var req = { SourceType: sourceType, SourceId: sourceId };
			var view = <PinBoardView>ViewBase.currentView;
			this.$results.hide();
			this.$input.val("");
			view.saveNewPlace(req);
		}

		public setCoordinates(lat, lng) {
			this.coordinates = { lat: lat, lng: lng };
		}

		private getItemHtml(item) {

			var context = {
				sourceId: item.SourceId,
				sourceType: item.SourceType,
				icoClass: this.getIconForSearch(item.SourceType),
				name: item.Name,
				countryCode: item.CountryCode
			}

			var html = "";
			if (item.SourceType === SourceType.City) {
					html = this.cityTemp(context);
			} else if (item.SourceType === SourceType.Country) {
					html = this.countryTemp(context);
			} else {
					html = this.socTemp(context);
			}

			this.template(context);
			return html;
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

			private mapControlsTmp;
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

			get pageType(): Views.PageType { return PageType.PinBoard; }

			constructor() {
					super();

					this.mapControlsTmp = this.registerTemplate("map-controls-template");
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
							id.create(this.t("ImportingCheckins", "jsPins"));

							this.apiPost("FbTaggedPlacesPermission", null, (r2) => {
									this.refreshData();
									id.remove();
							});
					});
			}

			public initialize() {

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
					this.switchMapType(Maps.DataType.Cities, Maps.MapType.D2);

					this.pinBoardBadges = new PinBoardBadges();

					this.shareDialogView = new ShareDialogPinsView();
					
					this.mapsManager.onCenterChanged = (center) => {
							this.search.setCoordinates(center.lat, center.lng);
					}

					
			}

			private switchMapType(dataType, mapType) {
					this.initMapType(false);
					this.initPlaceSearch(false);
					this.initShareDialog(false);

					this.mapsManager.switchToView(mapType, dataType, () => {
						var html = this.mapControlsTmp();
						$("#map").append(html);

						this.initMapType(true);
						this.initPlaceSearch(true);
						this.initShareDialog(true);
					});
		  }

			private viewChanged(group, val) {
					this.refreshData();
					//this.setMenuControls();					
			}

			private initMapType(create) {
				var $combo = $("#mapType");
				var $input = $combo.find("input");

				if (!create) {
					$combo.remove();
					return;
				}

				$input.val(this.currentMapType);

				Common.DropDown.registerDropDown($combo);
				Common.DropDown.setValue($combo, this.currentMapType);

				$input.change((e) => {
					this.currentMapType = parseInt($input.val());

					this.getFormState((dataType, mapType) => {
						this.switchMapType(dataType, mapType);
					});
					this.setMenuControls();
				});
			}

			private initPlaceSearch(create) {
					var $root = $(".place-search");

					if (!create) {
							$root.remove();
							return;
					}

					this.search = new PinBoardSearch($(".place-search"));
					this.search.onPlaceSelected = (request) => this.saveNewPlace(request);
			}

			private initShareDialog(create) {
					var $btn = $("#share-btn");

					if (!create) {
							$btn.remove();
							return;
					}

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
							$("#map").append($l);

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