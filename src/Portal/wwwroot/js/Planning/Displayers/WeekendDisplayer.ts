module Planning {

	export enum LocationGrouping { ByCity, ByCountry, ByContinent }
		
	export class WeekendDisplayer {

		private connections;
		private $cont;
		private filter: FilteringWeekend;

			
		constructor($cont, filter: FilteringWeekend) {
				this.$cont = $cont;
				this.filter = filter;
		}

		public showResults(connections, grouping: LocationGrouping) {
			this.connections = connections;

			var fs = this.filter.getState();

			if (grouping === LocationGrouping.ByCity) {					
					var agg1 = new WeekendByCityAgg();
					var r1 = agg1.exe(this.connections, fs.days, fs.starsLevel);
					
					var d1 = new WeekendByCityDis(this.$cont, fs.currentLevel);
					d1.render(r1);									
			}






			if (grouping === LocationGrouping.ByCountry) {					
					var agg2 = new GroupByCountry();
					var r2 = agg2.exe(this.connections);

					var d2 = new ByCountryDisplay(this.$cont, fs.currentLevel);
					d2.render(r2);
				}
			}

	}


		export class ByWeekDisplay {
			public onItemAppended: Function;

			private $cont;
			public scoreLevel;

			constructor($cont, scoreLevel) {
					this.$cont = $cont;
				this.scoreLevel = scoreLevel;
			}

			public render(data) {

				 this.$cont.empty();
					
					var weeks = _(data).chain()
							.sortBy("week")
							.sortBy("year")							
							.value();	
					
					var lg = Common.ListGenerator.init(this.$cont, "weekend-week-template");
					lg.clearCont = true;
					lg.customMapping = (w) => {

							var wr = DateOps.getWeekendRange(w.week);

							return {
									week: w.week,
									year: w.year,
									dateFrom: moment.utc(wr.friday).format("ll"),
									dateTo: moment.utc(wr.sunday).format("ll")
							}
					}

					lg.onItemAppended = ($week, week) => {
							this.onItemAppended($week, week);
					}

					lg.generateList(weeks);
			}


	}

		export class WeekendByCityDis extends ByWeekDisplay {
				
				constructor($cont, scoreLevel) {
					super($cont, scoreLevel);
						
					this.onItemAppended = ($week, week) => {
							this.generateWeek($week, week);
					}
			}

			private generateWeek($week, week) {
					var cities = _.sortBy(week.cities, "fromPrice");

				 var $weekCont = $week.find(".cont");

				 var lg = Common.ListGenerator.init($weekCont, "resultGroupItem-template");				

					lg.customMapping = (c) => {
							return {
									gid: c.gid,
									title: c.name,
									price: c.fromPrice
							}
					}

					lg.onItemAppended = ($city, city) => {
							this.generateCityFlightGroups($weekCont, $city, city);
					}

					lg.generateList(cities);
			}

			private generateCityFlightGroups($weekCont, $city, city) {

					var $cont = $city.find(".items table");
					var lg = Common.ListGenerator.init($cont, "resultGroup-priceItem-template");

					lg.listLimit = 2;
					lg.listLimitMoreTmp = "offers-expander-template";
					lg.listLimitLessTmp = "offers-collapser-template";

					lg.customMapping = (g) => {
							return {
									from: g.fromAirport,
									to: g.toAirport,
									price: g.fromPrice,
									flights: g.flights
							};
					}

					lg.evnt("td", (e, $item, $target, conn) => {

							var flights = FlightConvert.cFlights(conn.flights);

							var $lc = Common.LastItem.getLast($weekCont, "flight-result", $city.data("no"));

							var title = `Deals for ${name}`;
							
							var pairs: CodePair[] = [{ from: flights[0].from, to: flights[0].to }];

							var cd = new WeekendDetail(pairs, title, city.gid);
							cd.createLayout($lc);
							cd.init(flights);														
					});

					lg.generateList(city.flightsGroups);
			}


	}




		
	export class GroupByCountry {

			private weekGroups = [];

			public exe(connections) {
					connections.forEach((c) => {

							c.WeekFlights.forEach((weekFlight) => {
									var weekGroup = this.getOrCreateWeekGroup(weekFlight.WeekNo, weekFlight.Year);
									var country = this.getOrCreateCountry(weekGroup, c.CountryCode, c.CountryCode);
									var city = this.getOrCreateCity(c.ToCityId, c.CityName, country);
									
									var flightGroup = {
											fromPrice: weekFlight.FromPrice,
											fromAirport: c.FromAirport,
											toAirport: c.ToAirport,
											flights: weekFlight.Flights
									};

									if (!country.fromPrice) {
											country.fromPrice = weekFlight.FromPrice;
									} else if (country.fromPrice > weekFlight.FromPrice) {
											country.fromPrice = weekFlight.FromPrice;
									}

									if (!city.fromPrice) {
											city.fromPrice = weekFlight.FromPrice;
									} else if (city.fromPrice > weekFlight.FromPrice) {
											city.fromPrice = weekFlight.FromPrice;
									}

									city.flightsGroups.push(flightGroup);
							});

					});

					return this.weekGroups;
			}

			private getOrCreateWeekGroup(week, year) {

					var weekGroup = _.find(this.weekGroups, (wg) => { return wg.week === week && wg.year === year });
					if (!weekGroup) {
							weekGroup = {
									week: week,
									year: year,
									countries: []
							}
							this.weekGroups.push(weekGroup);
					}

					return weekGroup;
			}

			private getOrCreateCountry(weekGroup, countryCode, name) {
					var wgc = _.find(weekGroup.countries, (country) => { return country.countryCode === countryCode });
					if (!wgc) {
							wgc = {
									countryCode: countryCode,
									name: name,
									fromPrice: null,
									cities: []
									//flightsGroups: []

							}
							weekGroup.countries.push(wgc);
					}

					return wgc;
			}

		private getOrCreateCity(gid, name, countryGroup) {
			var city = _.find(countryGroup.cities, (c) => {
				return c.gid === gid;
			});

			if (!city) {
				city = {
					gid: gid,
					name: name,
					fromPrice: null,
					flightsGroups: []
					}
				countryGroup.cities.push(city);
			}

			return city;
		}

	}
		
	
		

	export class ByCountryDisplay extends ByWeekDisplay {

			constructor($cont, scoreLevel) {
					super($cont, scoreLevel);

					this.onItemAppended = ($week, week) => {
							this.generateWeek($week, week);
					}
			}

			private generateWeek($week, week) {
					var countries = _.sortBy(week.countries, "fromPrice");

					var lg = Common.ListGenerator.init($week.find(".cont"), "resultGroupItemCountry-template");
					lg.customMapping = (c) => {
							return {
									cc: c.countryCode,
									title: c.name,
									price: c.fromPrice
							}
					}

					lg.onItemAppended = ($country, country) => {
							this.generateCountryCities($country, country);
					}

					lg.generateList(countries);
			}

			private generateCountryCities($country, country) {
					var lg = Common.ListGenerator.init($country.find(".items table"), "grouped-country-city-template");

					lg.customMapping = (c) => {
							return {
									gid: c.gid,
									name: c.name,
									price: c.fromPrice,
									//flightsGroups - add when used							
							};
					}

					lg.generateList(country.cities);
			}


	}


	
	export class DateOps {

			public static getWeekendRange(weekNo) {
					var year = (new Date().getFullYear());
					var currentDate = new Date(year, 0);
					var currWeekNo = 0;

					var day11 = currentDate.getDay();
					//first week starts at thursday
					if (day11 <= 4) {
							currWeekNo = 1;
					}

					while (currWeekNo < weekNo) {
							currentDate = this.addDays(currentDate, 1);
							if (currentDate.getDay() === 1) {
									currWeekNo++;
							}
					}

					var friday = this.addDays(currentDate, 4);
					var sunday = this.addDays(friday, 2);

					return { friday: friday, sunday: sunday };
			}

			public static addDays(date, days) {
					var result = new Date(date);
					result.setDate(result.getDate() + days);
					return result;
			}
	}
	
}