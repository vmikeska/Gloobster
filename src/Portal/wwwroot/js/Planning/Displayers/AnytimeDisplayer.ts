module Planning {

	export class AnytimeDisplayer {

		private connections;
		private $cont;
		private filter: FilteringAnytime;

		constructor($cont, filter: FilteringAnytime) {
			this.$cont = $cont;
			this.filter = filter;
		}

		public showResults(connections, grouping: LocationGrouping) {
			this.connections = connections;

			var filterState = this.filter.getStateBase();

			if (grouping === LocationGrouping.ByCity) {
				var agg1 = new AnytimeByCityAgg(connections);

				var fs = this.filter.getStateBase();

				agg1.exe(fs.starsLevel);
					
				var dis = new AnytimeByCityDis(this.connections, filterState.currentLevel);
				dis.render(agg1.cities);
			}

			if (grouping === LocationGrouping.ByCountry) {
					var agg2 = new AnytimeByCountryAgg(connections);

					var fs2 = this.filter.getStateBase();

					agg2.exe(fs2.starsLevel);

					var dis2 = new AnytimeByCountryDis(this.connections, filterState.currentLevel);
					dis2.render(agg2.countries, $("#resultsCont"));
			}

			if (grouping === LocationGrouping.ByContinent) {
					var agg3 = new AnytimeByContinentAgg(connections);

					var fs3 = this.filter.getStateBase();

					agg3.exe(fs3.starsLevel);

					var dis3 = new AnytimeByContinentDis(this.connections, filterState.currentLevel);
					dis3.render(agg3.getAllConts());
			}


		}

	}

	export class AnytimeByCityDis {
		private $cont = $("#resultsCont");

		private connections;
			private scoreLevel;

			constructor(connections, scoreLevel) {
				this.connections = connections;
				this.scoreLevel = scoreLevel;
			}

		public render(cities) {
			cities = _.sortBy(cities, "fromPrice");

			var lg = Common.ListGenerator.init(this.$cont, "resultGroupItem-template");
			lg.clearCont = true;

			lg.customMapping = (i) => {
				return {
					gid: i.gid,
					title: i.name,
					price: i.fromPrice
				};
			}

			lg.onItemAppended = ($cityBox, item) => {
					this.genOffers($cityBox, item.bestFlights);
			};

			lg.generateList(cities);
		}

		private genOffers($cityBox, flights) {
				var lgi = Common.ListGenerator.init($cityBox.find("table"), "resultGroup-priceItem-template");
				lgi.listLimit = 2;
				lgi.listLimitMoreTmp = "offers-expander-template";
				lgi.listLimitLessTmp = "offers-collapser-template";
				
				lgi.evnt("td", (e, $connection, $td, eItem) => {
						var from = $connection.data("f");
						var to = $connection.data("t");
						var gid = $cityBox.data("gid");
						var name = $cityBox.data("name");

						var $lc = Common.LastItem.getLast(this.$cont, "flight-result", $cityBox.data("no"));

						var conn = _.find(this.connections, (c) => { return c.FromAirport === from && c.ToAirport === to });

						var flights = FlightConvert.cFlights(conn.Flights);

						var title = `Deals for ${name}`;

						var pairs: CodePair[] = [{ from: from, to: to }];

						var cd = new CityDetail(this.scoreLevel, pairs, title, name, gid);
						cd.createLayout($lc);
						cd.init(flights);
				});

				lgi.generateList(flights);
		}

	}

	export class AnytimeByCountryDis {
			private $cont;

			private connections;
			private scoreLevel;

			constructor(connections, scoreLevel) {
					this.connections = connections;
					this.scoreLevel = scoreLevel;
			}

			public render(countries, $cont) {
				  this.$cont = $cont;
					countries = _.sortBy(countries, "fromPrice");

					var lg = Common.ListGenerator.init(this.$cont, "resultGroupItemCountry-template");
					lg.clearCont = true;
					
					lg.customMapping = (i) => {
							return {
									cc: i.cc,
									title: i.name,
									price: i.fromPrice
							};
					}

					lg.onItemAppended = ($country, country) => {
							this.genOffers($country, country.cities);
					};

					lg.generateList(countries);
			}

			private genOffers($cityBox, cities) {
					cities = _.sortBy(cities, "fromPrice");

					var lgi = Common.ListGenerator.init($cityBox.find("table"), "grouped-country-city-template");
					lgi.customMapping = (i) => {
						return {
							gid: i.gid,
							name: i.name,
							price: i.fromPrice
						};
					}

					lgi.listLimit = 2;
					lgi.listLimitMoreTmp = "offers-expander-template";
					lgi.listLimitLessTmp = "offers-collapser-template";

					lgi.evnt(null, (e, $tr, $target, item) => {														
							var gid = $tr.data("gid");
						  
							var $lc = Common.LastItem.getLast(this.$cont, "flight-result", $cityBox.data("no"));

							var conn = _.filter(this.connections, (c) => { return c.ToCityId === gid });
							var first = _.first(conn);
							var name = first.CityName;
							
							var flights = [];
							var pairs: CodePair[] = [];

							conn.forEach((c) => {
									pairs.push({ from: c.FromAirport, to: c.ToAirport });

									c.Flights.forEach((f) => {
									var flight = FlightConvert.cFlight(f);
									flights.push(flight);
								});
							});
							
							var title = `Deals for ${name}`;

							var cd = new CityDetail(this.scoreLevel, pairs, title, name, gid);
							cd.createLayout($lc);
							cd.init(flights);
					});

					lgi.generateList(cities);
			}
	}

		export class AnytimeByContinentDis {
			private $cont = $("#resultsCont");

			private connections;
			private continents = [];
			private scoreLevel;

			constructor(connections, scoreLevel) {
				this.connections = connections;
				this.scoreLevel = scoreLevel;
			}

			public render(conts) {

				this.mapContObjs(conts);

				var lg = Common.ListGenerator.init(this.$cont, "continent-group-template");
				lg.clearCont = true;
					
				lg.onItemAppended = ($continent, continent) => {
					this.genCountries($continent, continent.countries);
				};

				lg.evnt(".visi", (e, $item, $target, item) => {
						var vis = Boolean($target.data("v"));

						var txt = vis ?  "expand" : "collapse";
						$target.html(txt);

						$item.find(".cont").toggle(!vis);
						
						$target.data("v", !vis);
					});

				lg.generateList(this.continents);
			}

			private genCountries($continent, countries) {
					var bc = new AnytimeByCountryDis(this.connections, this.scoreLevel);
					bc.render(countries, $continent.find(".cont"));
			}

			private mapContObjs(conts) {

				if (conts.europe.length > 0) {
					this.addCont("Europe", conts.europe);
				}

				if (conts.nAmerica.length > 0) {
					this.addCont("North America", conts.nAmerica);
				}

				if (conts.sAmerica.length > 0) {
					this.addCont("South America", conts.sAmerica);
				}

				if (conts.asia.length > 0) {
					this.addCont("Asia", conts.asia);
				}

				if (conts.australia.length > 0) {
					this.addCont("Australia", conts.australia);
				}

				if (conts.africa.length > 0) {
					this.addCont("Africa", conts.africa);
				}
			}

			private addCont(name, countries) {
				var cont = {
					name: name,
					countries: countries
				}
				this.continents.push(cont);
			}


		}

}