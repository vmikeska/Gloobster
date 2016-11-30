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
					dis2.render(agg2.countries);
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
				
				lgi.evnt("td", (e, $connection, $td, eItem) => {
						var from = $connection.data("f");
						var to = $connection.data("t");
						var gid = $cityBox.data("gid");
						var name = $cityBox.data("name");

						var $lc = Common.LastItem.getLast(this.$cont, "flight-result", $cityBox.data("no"));

						var conn = _.find(this.connections, (c) => { return c.FromAirport === from && c.ToAirport === to });

						var cd = new CityDetail(this.scoreLevel, from, to, name, gid);
						cd.createLayout($lc);
						cd.init(conn.Flights);						
				});

				lgi.generateList(flights);
		}

	}

	export class AnytimeByCountryDis {
			private $cont = $("#resultsCont");

			private connections;
			private scoreLevel;

			constructor(connections, scoreLevel) {
					this.connections = connections;
					this.scoreLevel = scoreLevel;
			}

			public render(countries) {
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
					
					lgi.evnt(null, (e, $tr, $target, item) => {							
							var from = "from";
							var to = "to";

							var gid = $tr.data("gid");
						  
							var $lc = Common.LastItem.getLast(this.$cont, "flight-result", $cityBox.data("no"));

							var conn = _.filter(this.connections, (c) => { return c.ToCityId === gid });
							var first = _.first(conn);
							var name = first.CityName;

							
							var flights = [];
							conn.forEach((c) => {
								c.Flights.forEach((f) => {
									flights.push(f);
								});
							});
						
							var cd = new CityDetail(this.scoreLevel, from, to, name, gid);
							cd.createLayout($lc);
							cd.init(flights);
					});

					lgi.generateList(cities);
			}
	}
		
	export class AnytimeAggUtils {


			public static checkFilter(flight, starsLevel: number) {
				var scoreOk = this.matchesScore(flight, starsLevel);
			return scoreOk;
		}

		private static matchesScore(flight, starsLevel) {
			if (starsLevel === 1) {
				return true;
			}

			var stars = this.getScoreStars(flight.FlightScore);
			if ((starsLevel === 5) && _.contains([5, 4], stars)) {
				return true;
			}
			if ((starsLevel === 3) && _.contains([5, 4, 3, 2], stars)) {
				return true;
			}

			return false;
		}

		public static getScoreStars(index) {
				var percents = index * 100;
				
				if (percents >= 90) {
					return 5;
				}
				if (percents >= 80) {
						return 4;
				}
				if (percents >= 70) {
						return 3;
				}
				if (percents >= 60) {
						return 2;
				}

				return 1;				
		}

		//var daysOk = this.daysFilter(flight, daysFrom, daysTo);

			//private static getFlightDays(flight) {
			//		var fp = _.first(flight.FlightParts);
			//		var lp = _.last(flight.FlightParts);
			//		var f = fp.DeparatureTime;
			//		var t = lp.ArrivalTime;

			//		var fd = new Date(f);
			//		var td = new Date(t);
			//		var timeDiff = Math.abs(td.getTime() - fd.getTime());
			//		var days = Math.ceil(timeDiff / (1000 * 3600 * 24));

			//		return { from: f, to: t, days: days };
			//}

			//private static daysFilter(flight, daysFrom, daysTo) {
			//		var fd = this.getFlightDays(flight);

			//		var fits = daysFrom === null || ((fd.days >= daysFrom) && (fd.days <= daysTo));
			//		return fits;
			//}
	}

		export class AnytimeByCountryAgg {

			public countries = [];

			public connections;

			constructor(connections) {
					this.connections = connections;
			}

			public exe(starsLevel: number) {

					this.connections.forEach((c) => {

							var passedFlights = [];

							c.Flights.forEach((f) => {
									var filterMatch = AnytimeAggUtils.checkFilter(f, starsLevel);
									if (filterMatch) {
											passedFlights.push(f);
									}
							});
							
							if (passedFlights.length > 0) {
									var country = this.getCountry(c.CountryCode, c.CountryCode);
									var city = this.getCity(country, c.ToCityId, c.CityName);

									var fromPrice = _.min(_.map(passedFlights, (pf) => { return pf.Price }));

									if (!country.fromPrice) {
											country.fromPrice = fromPrice;
									} else if (country.fromPrice > fromPrice) {
											country.fromPrice = fromPrice;
									}

									if (!city.fromPrice) {
											city.fromPrice = fromPrice;
									} else if (city.fromPrice > fromPrice) {
											city.fromPrice = fromPrice;
									}									
							}

					});
			}
				
			private getCountry(cc, name) {
					var country = _.find(this.countries, (c) => { return c.cc === cc });

					if (!country) {
							country = {
									cc: cc,
									name: name,									
									fromPrice: null,
									cities: []
							};

							this.countries.push(country);
					}

					return country;
			}

			private getCity(country, gid, name) {
				var city = _.find(country.cities, (c) => { return c.gid === gid });

				if (!city) {
					city = {
						gid: gid,
						name: name,
						fromPrice: null
					};

					country.cities.push(city);
				}

				return city;
			}

		}


	export class AnytimeByCityAgg {

			public cities = [];

			public connections;

			constructor(connections) {
					this.connections = connections;
			}

			public exe(starsLevel) {

			this.connections.forEach((c) => {

				var passedFlights = [];

				c.Flights.forEach((f) => {
						var filterMatch = AnytimeAggUtils.checkFilter(f, starsLevel);
						if (filterMatch) {
								passedFlights.push(f);
						}
				});

				if (passedFlights.length > 0) {
					var city = this.getOrCreateCity(c.ToCityId, c.CityName, c.CountryCode);

					var bestFlight = {
						from: c.FromAirport,
						to: c.ToAirport,
						price: _.min(_.map(passedFlights, (pf) => { return pf.Price }))
					}

					city.bestFlights.push(bestFlight);

					if (!city.fromPrice) {
						city.fromPrice = bestFlight.price;
					} else if (city.fromPrice > bestFlight.price) {
						city.fromPrice = bestFlight.price;
					}
				}

			});
		}
			
			private getOrCreateCity(gid, name, countryCode) {

					var city = _.find(this.cities, (c) => { return c.gid === gid });

					if (!city) {
							city = {
									gid: gid,
									name: name,
									cc: countryCode,
									fromPrice: null,
									bestFlights: []
							};

							this.cities.push(city);
					}

					return city;
			}

	}


}