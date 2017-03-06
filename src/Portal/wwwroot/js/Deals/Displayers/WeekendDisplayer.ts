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
				var results = FlightsExtractor.getResults(this.queries);

				var days = this.filter.getState();

			if (grouping === LocationGrouping.ByCity) {				  
					var agg1 = new WeekendByCityAgg();
					
					var r1 = agg1.exe(this.queries, days, DealsLevelFilter.currentStars);
					
					var d1 = new WeekendByCityDis(this.$cont, results, DealsLevelFilter.currentScore);
					d1.render(r1);									
			}
				
			if (grouping === LocationGrouping.ByCountry) {										
					var agg2 = new WeekendByCountryAgg();

					var r2 = agg2.exe(this.queries, days, DealsLevelFilter.currentStars);

					var d2 = new ByCountryDisplay(this.$cont, results, DealsLevelFilter.currentScore);
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
		  protected results;

			constructor($cont, results, scoreLevel) {
					this.$cont = $cont;
					this.scoreLevel = scoreLevel;
				  this.results = results;
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

		export class WeekendCityResultsItemsGenerator extends ResultsItemsGenerator {
				
				constructor($cont, results, scoreLevel) {						
						super(ResultConfigs.bigCity, ResultConfigs.smallCity, $cont, results, scoreLevel);
						this.type = FlightCacheRecordType.City;
						this.$cont = $cont;
				}

				public getItems(data) {
						return data.flightsGroups;
				}

			public regEvent($group, $item, group, item) {
				var flights = FlightConvert2.cFlights(item.flights);

				var $lc = Common.LastItem.getLast(this.$cont, this.config.groupClass, $group.data("no"));

				var title = `${this.v.t("DealsFor", "jsDeals")} ${group.name}`;

				var pairs: CodePair[] = [{ from: flights[0].from, to: flights[0].to }];

				var cd = new WeekendDetail(pairs, title, group.gid);
				cd.createLayout($lc);
				cd.init(flights);
			}

			protected groupMapping(group) {
						return {
								gid: group.gid,
								title: group.name,
								price: group.fromPrice
						};
				}

				protected itemMapping(item) {
						return {
								from: item.fromAirport,
								to: item.toAirport,
								price: item.fromPrice,
								flights: item.flights
						};
				}



		}
		
		export class WeekendByCityDis extends ByWeekDisplay {
				
				constructor($cont, results, scoreLevel) {
					super($cont, results, scoreLevel);
						
					this.onItemAppended = ($week, week) => {
							this.generateWeek($week, week);
					}
			}

			private generateWeek($week, week) {					
					var $weekCont = $week.find(".cont");
					
					var dis1 = new WeekendCityResultsItemsGenerator($weekCont, this.results, DealsLevelFilter.currentScore);
					dis1.generate(week.cities);
			}				
	}

		export class WeekendCountryResultsItemsGenerator extends ResultsItemsGenerator {
				constructor($cont, results, scoreLevel) {
						super(ResultConfigs.bigCountry, ResultConfigs.smallCountry, $cont, results, scoreLevel);
						this.type = FlightCacheRecordType.Country;
				}

				public getItems(data) {
						return data.cities;
				}

				protected groupMapping(group) {
						return {
								cc: group.countryCode,
								title: group.name,
								price: group.fromPrice
						};
				}

				protected itemMapping(item) {
						return {
								gid: item.gid,
								name: item.name,
								price: item.fromPrice
						};
				}

				protected regEvent($group, $item, group, item) {

						var flightsOrig = this.extractFlights(item.flightsGroups);
						var flights = FlightConvert2.cFlights(flightsOrig);

						var $lc = Common.LastItem.getLast(this.$cont, "flight-result", $group.data("no"));
						
						var title = `${this.v.t("DealsFor", "jsDeals")} ${item.name}`;

						var pairs: CodePair[] = [{ from: flights[0].from, to: flights[0].to }];

						var gid = 0;
						var cd = new WeekendDetail(pairs, title, gid);
						cd.createLayout($lc);
						cd.init(flights);						
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

		export class ByCountryDisplay extends ByWeekDisplay {

			constructor($cont, results, scoreLevel) {
					super($cont, results, scoreLevel);

					this.onItemAppended = ($week, week) => {
							this.generateCountries($week, week);
					}
			}

			private generateCountries($week, week) {					
				  var $weekCont = $week.find(".cont");

					var gen = new WeekendCountryResultsItemsGenerator($weekCont, this.results, this.scoreLevel);
					gen.generate(week.countries);
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