module Views {
	export class PinBoardBadges {
		public mapsManager: Maps.MapsManager;
		public aggegatedCountries: AggregatedCountries;
		public aggreagatedCities: string[];
		public visitedTotal = 0;

		private europeCities = [
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

		private asiaCities = [
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

		private naCities = [
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

		private saCities = [
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

		private afCities = [
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
	 
		get mapsDataLoader(): Maps.MapsDataLoader {
			var mdl = ViewBase.currentView["mapsManager"].mapsDataLoader;
			return mdl;
		}

		public refresh(type: Maps.DisplayEntity) {
			$("#bdgs").html("");
			//this.visitedTotal = 0;
			if (type === Maps.DisplayEntity.Pin) {
				this.aggregateCities();
				this.generateCities();
			}

			if (type === Maps.DisplayEntity.Countries) {
				this.aggregateCountries();
				this.generateOverview();
			}
		}
	 
		private aggregateCountries() {
		 var countries = _.map(this.mapsDataLoader.places.countries, (c) => { return c.CountryCode2; });
		 var states = _.map(this.mapsDataLoader.places.states, (c) => { return c.StateCode; });
			this.aggegatedCountries = new AggregatedCountries();
			this.aggegatedCountries.aggregate(countries);
			this.aggegatedCountries.aggregateUs(states);
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
			var usHtml = this.genOverviewItem("states-us.png", this.aggegatedCountries.usVisited, this.aggegatedCountries.usTotal, "US");

			var html = afrHtml + eurHtml + asiHtml + ausHtml + naHtml + saHtml + euHtml + usHtml;
			var allHtml = `<h2 class="citiesCont">Overview</h2><div class="badges grid margin2 citiesCont">${html}</div>`;
			$("#bdgs").html(allHtml);
		}

		private generateCities() {
			//$(".citiesCont").remove();		 
			var eurHtml = this.genContCitiesSection("Europe", this.europeCities);
			var asiHtml = this.genContCitiesSection("Asia", this.asiaCities);
			var naHtml = this.genContCitiesSection("North America", this.naCities);
			var saHtml = this.genContCitiesSection("South and Central America", this.saCities);
			var afHtml = this.genContCitiesSection("Africa", this.afCities);

			var html = eurHtml + asiHtml + naHtml + saHtml + afHtml;
			$("#bdgs").html(html);
		}

		private genContCitiesSection(continentName: string, cities) {
			var vHtml = "";
			var uHtml = "";
			this.visitedTotal = 0;
			cities.forEach((city) => {
				var visited = _.contains(this.aggreagatedCities, city.g);
				if (visited) {
					this.visitedTotal++;
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
}