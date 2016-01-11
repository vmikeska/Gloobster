module Views {

	export class PinBoardBadges {
		public mapsManager: Maps.MapsManager;
		public aggegatedCountries: AggregatedCountries;

		get mapsDataLoader(): Maps.MapsDataLoader {
			var mdl = Views.ViewBase.currentView["mapsManager"].mapsDataLoader;
			return mdl;
		}

		public refresh() {
			this.aggregateCountries();
			this.generateOverview();
		}


		private aggregateCountries() {
		 var countries = _.map(this.mapsDataLoader.places.countries, (c) => { return c.CountryCode2; });
		 this.aggegatedCountries = new AggregatedCountries();
		 this.aggegatedCountries.aggregate(countries);
		}

		private generateOverview() {
		 var afrHtml = this.genOverviewItem("africa.png", this.aggegatedCountries.africaVisited, this.aggegatedCountries.africaTotal, "Africa");
		 var eurHtml = this.genOverviewItem("europe.png", this.aggegatedCountries.europeVisited, this.aggegatedCountries.europeTotal, "Europe");
		 var asiHtml = this.genOverviewItem("asia.png", this.aggegatedCountries.asiaVisited, this.aggegatedCountries.asiaTotal, "Asia");
		 var ausHtml = this.genOverviewItem("australia.png", this.aggegatedCountries.australiaVisited, this.aggegatedCountries.australiaTotal, "Australia");
		 var naHtml = this.genOverviewItem("north-amecica.png", this.aggegatedCountries.northAmericaVisited, this.aggegatedCountries.northAmericaTotal, "North America");
		 var saHtml = this.genOverviewItem("south-america.png", this.aggegatedCountries.southAmericaVisited, this.aggegatedCountries.southAmericaTotal, "South America");

			var html = afrHtml + eurHtml + asiHtml + ausHtml + naHtml + saHtml;
			$("#badgesOverview").html(html);
		}

		private genOverviewItem(img, visitedCnt, totalCnt, name) {
			var imgLink = "../images/badges/" + img;
			return `<div class="cell"><span class="badge active"><span class="thumbnail"><img src="${imgLink}"></span>${visitedCnt}/${totalCnt} <b>${name}</b></span></div>`;
		}
	}

	export class AggregatedCountries {
		public africa = ["DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GW", "GN", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SD", "SZ", "TZ", "TG", "TN", "UG", "ZM", "TZ", "ZW", "SS", "CD"];
		public europe = ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FO", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "MC", "NL", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "ME"];
		public asia = ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP", "KR", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PH", "QA", "SA", "SG", "LK", "SY", "TJ", "TH", "TR", "TM", "AE", "UZ", "VN", "YE"];
		public austraila = ["AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "SB", "TO", "TV", "VU", "WS", "TL"];
		public northAmerica = ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"];
		public southAmerica = ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"];
		//todo: one extra country ? Find out which

		public africaTotal = 55;
		public europeTotal = 45;
		public asiaTotal = 45;
		public australiaTotal = 15;
		public northAmericaTotal = 22;
		public southAmericaTotal = 12;

		public africaVisited = 0;
		public europeVisited = 0;
		public asiaVisited = 0;
		public australiaVisited = 0;
		public northAmericaVisited = 0;
		public southAmericaVisited = 0;


		public aggregate(countries) {
			this.africaVisited = 0;

			countries.forEach((c) => {
				var af = _.contains(this.africa, c);
				if (af) {
					this.africaVisited++;
				}

				var eur = _.contains(this.europe, c);
				if (eur) {
					this.europeVisited++;
				}

				var asi = _.contains(this.asia, c);
				if (asi) {
					this.asiaVisited++;
				}

				var aus = _.contains(this.austraila, c);
				if (aus) {
					this.australiaVisited++;
				}

				var na = _.contains(this.northAmerica, c);
				if (na) {
					this.northAmericaVisited++;
				}

				var sa = _.contains(this.southAmerica, c);
				if (sa) {
					this.southAmericaVisited++;
				}


			});
		}
	}

	export class PinBoardView extends ViewBase {

		public mapsManager: Maps.MapsManager;
		private placeSearch: Common.PlaceSearchBox;

		private shareDialogView: ShareDialogPinsView;
		private fbPermissions: Common.FacebookPermissions;
		private currentLegend: any;

		private pinBoardBadges: PinBoardBadges;
	
		get pageType(): Views.PageType { return PageType.PinBoard; }

		public initialize() {
			this.mapsManager = new Maps.MapsManager();
			this.mapsManager.onDataChanged = () => {
				this.pinBoardBadges.refresh();
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
				this.refreshData(false);
			});

			$("#projectionType li").click(() => {
				this.refreshData(false);
			});

			this.setTagPlacesVisibility();

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