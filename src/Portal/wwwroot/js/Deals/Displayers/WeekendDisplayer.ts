module Planning {

	export enum LocationGrouping { ByCity, ByCountry, ByContinent }
		
	export class WeekendDisplayer implements IDisplayer {
		private queries;
		private $cont;

		private filter: DaysFilter;
			
		constructor($cont, filter: DaysFilter) {
			this.$cont = $cont;
			this.filter = filter;
		}

		public showResults(queries, grouping: LocationGrouping) {
				this.queries = queries;

				var days = this.filter.getState();

			if (grouping === LocationGrouping.ByCity) {				  
					var agg1 = new WeekendByCityAgg();
					
					var r1 = agg1.exe(this.queries, days, DealsLevelFilter.currentStars);
					
					var d1 = new WeekendByCityDis(this.$cont, DealsLevelFilter.currentScore);
					d1.render(r1);									
			}
				
			if (grouping === LocationGrouping.ByCountry) {										
					var agg2 = new WeekendByCountryAgg();

					var r2 = agg2.exe(this.queries, days, DealsLevelFilter.currentStars);

					var d2 = new ByCountryDisplay(this.$cont, DealsLevelFilter.currentScore);
					d2.render(r2);
				}
			}

		public refresh(grouping: LocationGrouping) {
			this.showResults(this.queries, grouping);
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
				 AnytimeAggUtils.enrichMoreLess(lg);
					lg.customMapping = (c) => {
							return {
									gid: c.gid,
									title: c.name,
									price: c.fromPrice
							}
					}

					lg.onItemAppended = ($city, city) => {
							this.generateCity($weekCont, $city, city);
					}

					lg.generateList(cities);
			}

			private generateCity($weekCont, $city, city) {

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

							var flights = FlightConvert2.cFlights(conn.flights);

							var $lc = Common.LastItem.getLast($weekCont, "flight-result", $city.data("no"));

							var v = Views.ViewBase.currentView;
							
							var title = `${v.t("DealsFor", "jsDeals")} ${city.name}`;
							
							var pairs: CodePair[] = [{ from: flights[0].from, to: flights[0].to }];

							var cd = new WeekendDetail(pairs, title, city.gid);
							cd.createLayout($lc);
							cd.init(flights);														
					});

					lg.generateList(city.flightsGroups);
			}


	}
		
	export class ByCountryDisplay extends ByWeekDisplay {

			constructor($cont, scoreLevel) {
					super($cont, scoreLevel);

					this.onItemAppended = ($week, week) => {
							this.generateCountries($week, week);
					}
			}

			private generateCountries($week, week) {
					var countries = _.sortBy(week.countries, "fromPrice");

				  var $weekCont = $week.find(".cont");

					var lg = Common.ListGenerator.init($weekCont, "resultGroupItemCountry-template");
					AnytimeAggUtils.enrichMoreLess(lg);
					lg.customMapping = (c) => {
							return {
									cc: c.countryCode,
									title: c.name,
									price: c.fromPrice
							}
					}

					lg.onItemAppended = ($country, country) => {
							this.generateCountryCities($country, country, $weekCont);
					}

					lg.generateList(countries);
			}

			private generateCountryCities($country, country, $weekCont) {
					var lg = Common.ListGenerator.init($country.find(".items table"), "grouped-country-city-template");

					lg.listLimit = 2;
					lg.listLimitMoreTmp = "offers-expander-template";
					lg.listLimitLessTmp = "offers-collapser-template";

					lg.customMapping = (c) => {

					var flights = this.extractFlights(c.flightsGroups);
							
					return {
						gid: c.gid,
						name: c.name,
						price: c.fromPrice,
						flights: flights
					};
				}

				lg.evnt("td", (e, $item, $target, conn) => {

						var flightsOrig = this.extractFlights(conn.flightsGroups);
						var flights = FlightConvert2.cFlights(flightsOrig);

						var $lc = Common.LastItem.getLast($weekCont, "flight-result", $country.data("no"));

						var v = Views.ViewBase.currentView;

						var title = `${v.t("DealsFor", "jsDeals")} ${name}`;
						
							var pairs: CodePair[] = [{ from: flights[0].from, to: flights[0].to }];

						var gid = 0;
							var cd = new WeekendDetail(pairs, title, gid);
							cd.createLayout($lc);
							cd.init(flights);
					});

					lg.generateList(country.cities);
			}

			private extractFlights(flightsGroups) {
					var fgs = _.map(flightsGroups, (fg) => {
							return fg.flights;
					});

					var flights = [];

					fgs.forEach((fgi) => {
							flights = flights.concat(fgi);
					});

				return flights;
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