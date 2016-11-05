module Planning {

	export class ByWeekDisplay {
		public onItemAppended: Function;

		private $cont;

		constructor($cont) {
			this.$cont = $cont;
		}

		public render(data) {

			var weeks = _.sortBy(data, "week"); //todo: year as well

			var lg = Common.ListGenerator.init(this.$cont, "weekend-week-template");
			lg.clearCont = true;
			lg.customMapping = (w) => {

				var wr = DateOps.getWeekendRange(w.week);

				return {
					week: w.week,
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

	export class ByCountryDisplay extends ByWeekDisplay {

		constructor($cont) {
			super($cont);

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


	export class ByCityDisplay extends ByWeekDisplay {


		constructor($cont) {
			super($cont);

			this.onItemAppended = ($week, week) => {
				this.generateWeek($week, week);
			}
		}

		private generateWeek($week, week) {
			var cities = _.sortBy(week.cities, "fromPrice");

			var lg = Common.ListGenerator.init($week.find(".cont"), "resultGroupItem-template");
			lg.customMapping = (c) => {
				return {
					gid: c.gid,
					title: c.name,
					price: c.fromPrice
				}
			}

			lg.onItemAppended = ($city, city) => {
				this.generateCityFlightGroups($city, city);
			}

			lg.generateList(cities);
		}

		private generateCityFlightGroups($city, city) {
			var lg = Common.ListGenerator.init($city.find(".items table"), "resultGroup-priceItem-template");

			lg.customMapping = (g) => {
				return {
					from: g.fromAirport,
					to: g.toAirport,
					price: g.fromPrice,
					flights: g.flights
				};
			}

			lg.generateList(city.flightsGroups);
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