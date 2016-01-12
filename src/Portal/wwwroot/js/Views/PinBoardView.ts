module Views {

	export class PinBoardBadges {
		public mapsManager: Maps.MapsManager;
		public aggegatedCountries: AggregatedCountries;
	  public aggreagatedCities: string[];

		get mapsDataLoader(): Maps.MapsDataLoader {
			var mdl = Views.ViewBase.currentView["mapsManager"].mapsDataLoader;
			return mdl;
		}

		public refresh() {
			this.aggregateCountries();
			this.generateOverview();
			this.aggregateCities();
		  this.generateCities();
		}


		private aggregateCountries() {
		 var countries = _.map(this.mapsDataLoader.places.countries, (c) => { return c.CountryCode2; });
		 this.aggegatedCountries = new AggregatedCountries();
		 this.aggegatedCountries.aggregate(countries);
		}
	 
	  private aggregateCities() {
		 this.aggreagatedCities = _.map(this.mapsDataLoader.places.cities, (c) => {
			  return c.GeoNamesId;
		 });
	  }

		private generateOverview() {
		 var afrHtml = this.genOverviewItem("africa.png", this.aggegatedCountries.africaVisited, this.aggegatedCountries.africaTotal, "Africa");
		 var eurHtml = this.genOverviewItem("europe.png", this.aggegatedCountries.europeVisited, this.aggegatedCountries.europeTotal, "Europe");
		 var asiHtml = this.genOverviewItem("asia.png", this.aggegatedCountries.asiaVisited, this.aggegatedCountries.asiaTotal, "Asia");
		 var ausHtml = this.genOverviewItem("australia.png", this.aggegatedCountries.australiaVisited, this.aggegatedCountries.australiaTotal, "Australia");
		 var naHtml = this.genOverviewItem("north-amecica.png", this.aggegatedCountries.northAmericaVisited, this.aggegatedCountries.northAmericaTotal, "North America");
		 var saHtml = this.genOverviewItem("south-america.png", this.aggegatedCountries.southAmericaVisited, this.aggegatedCountries.southAmericaTotal, "South America");

		 var euHtml = this.genOverviewItem("states-eu.png", this.aggegatedCountries.euVisited, this.aggegatedCountries.euTotal, "EU");

			var html = afrHtml + eurHtml + asiHtml + ausHtml + naHtml + saHtml + euHtml;
			$("#badgesOverview").html(html);
		}

		private generateCities() {
			$(".citiesCont").remove();

			var europeCities = [
				{ i: "london.png", n: "London", g: 2643743 },
				{ i: "barcelona.png", n: "Barcelona", g: 3128760 },
				{ i: "paris.png", n: "Paris", g: 2988507 },
				{ i: "rome.png", n: "Rome", g: 3169070 },
				{ i: "prague.png", n: "Prague", g: 3067696 },
				{ i: "amsterdam.png", n: "Amsterdam", g: 2759794 },
				{ i: "berlin.png", n: "Berlin", g: 2950159 },
				{ i: "budapest.png", n: "Budapest", g: 3054643 },
				{ i: "istanbul.png", n: "Istanbul", g: 745044 }
			];

			var asiaCities = [
				{ i: "bangkok.png", n: "Bangkok", g: 1609350 },
				{ i: "tokyo.png", n: "Tokyo", g: 1850147 },
				{ i: "dubai.png", n: "Dubai", g: 292223 },
				{ i: "hong-kong.png", n: "Hong Kong", g: 1819729 },
				{ i: "seoul.png", n: "Seoul", g: 1835848 },
				{ i: "kuala-lumpur.png", n: "Kuala Lumpur", g: 1735161 },
				{ i: "singapore.png", n: "Singapore", g: 1880252 },
				{ i: "shanghai.png", n: "Shanghai", g: 1796236 },
				{ i: "taipei.png", n: "Taipei", g: 1668341 }
			];

			var naCities = [
				{ i: "new-york.png", n: "New York", g: 5128581 },
				{ i: "miami.png", n: "Miami", g: 4164138 },
				{ i: "los-angeles.png", n: "Los Angeles", g: 5368361 },
				{ i: "orlando.png", n: "Orlando", g: 4167147 },
				{ i: "san-francisco.png", n: "San Francisco", g: 5391959 },
				{ i: "las-vegas.png", n: "Las Vegas", g: 5506956 },
				{ i: "honolulu.png", n: "Honolulu", g: 5856195 },
				{ i: "washington.png", n: "Washington", g: 4140963 },
				{ i: "chicago.png", n: "Chicago", g: 4887398 }
			];

			var saCities = [
				{ i: "mexico-city.png", n: "Mexico City", g: 3530597 },
				{ i: "buenos-aires.png", n: "Buenos Aires", g: 3435910 },
				{ i: "sao-paulo.png", n: "Sao Paulo", g: 3448439 },
				{ i: "lima.png", n: "Lima", g: 3936456 },
				{ i: "san-jose.png", n: "San Jose", g: 3621849 },
				{ i: "bogota.png", n: "Bogota", g: 3688689 },
				{ i: "montevideo.png", n: "Montevideo", g: 3441575 },
				{ i: "rio-de-janeiro.png", n: "Rio de Janeiro", g: 3451190 },
				{ i: "santiago-de-chile.png", n: "Santiago de Chile", g: 3871336 }
			];

			var afCities = [
				{ i: "johannesburg.png", n: "Johannesburg", g: 993800 },
				{ i: "cape-town.png", n: "Cape Town", g: 3369157 },
				{ i: "cairo.png", n: "Cairo", g: 360630 },
				{ i: "casablanca.png", n: "Casablanca", g: 2553604 },
				{ i: "tunis.png", n: "Tunis", g: 2464470 },
				{ i: "durban.png", n: "Durban", g: 1007311 },
				{ i: "lagos.png", n: "Lagos", g: 2332459 },
				{ i: "nairobi.png", n: "Nairobi", g: 184745 },
				{ i: "accra.png", n: "Accra", g: 2306104 }
			];

			var eurHtml = this.genContCitiesSection("Top 9 cities — Europe", europeCities);
			var asiHtml = this.genContCitiesSection("Top 9 cities — Asia", asiaCities);
			var naHtml = this.genContCitiesSection("Top 9 cities — North America", naCities);
			var saHtml = this.genContCitiesSection("Top 9 cities — South and Central America", saCities);
			var afHtml = this.genContCitiesSection("Top 9 cities — Africa", afCities);

			var html = eurHtml + asiHtml + naHtml + saHtml + afHtml;
			$("#badgesOverview").after(html);
		}


		private genContCitiesSection(continentName: string, cities) {
			var vHtml = "";
			var uHtml = "";
			cities.forEach((city) => {
				var visited = _.contains(this.aggreagatedCities, city.g);
				if (visited) {
					vHtml += `<div class="cell"><span class="badge active"><span class="thumbnail"><img src="../images/badges/${city.i}"></span>${city.n}</span></div>`;
				} else {
					uHtml += `<div class="cell"><span class="badge" style="opacity: 0.5"><span class="thumbnail"><img src="../images/badges/${city.i}"></span>${city.n}</span></div>`;
				}
			});

			var cHtml = vHtml + uHtml;
			var html = `<h2 class="citiesCont">${continentName}</h2><div class="badges grid margin2 citiesCont">${cHtml}</div>`;
			return html;
		}


		private genOverviewItem(img, visitedCnt, totalCnt, name) {
			var imgLink = "../images/badges/" + img;
			return `<div class="cell"><span class="badge active"><span class="thumbnail"><img src="${imgLink}"></span>${visitedCnt}/${totalCnt} <b>${name}</b></span></div>`;
		}
	}

	export class AggregatedCities {
		
	}

	export class AggregatedCountries {
		public africa = ["DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GW", "GN", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SD", "SZ", "TG", "TN", "UG", "ZM", "TZ", "ZW", "SS", "CD"];
		public europe = ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FO", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "MC", "NL", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "ME"];
		public asia = ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP", "KR", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PH", "QA", "SA", "SG", "LK", "SY", "TJ", "TH", "TR", "TM", "AE", "UZ", "VN", "YE"];
		public austraila = ["AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "SB", "TO", "TV", "VU", "WS", "TL"];
		public northAmerica = ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"];
		public southAmerica = ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"];		
		public eu = ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE", "UK"];
	 
		public africaTotal = 54;
		public europeTotal = 45;
		public asiaTotal = 45;
		public australiaTotal = 15;
		public northAmericaTotal = 22;
		public southAmericaTotal = 12;
		public euTotal = 28;

		public africaVisited = 0;
		public europeVisited = 0;
		public asiaVisited = 0;
		public australiaVisited = 0;
		public northAmericaVisited = 0;
		public southAmericaVisited = 0;
	  public euVisited = 0;


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

				var eu = _.contains(this.eu, c);
				if (eu) {
				 this.euVisited++;
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