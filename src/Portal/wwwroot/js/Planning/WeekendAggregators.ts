module Planning {

	export enum LocationGrouping { None, ByCity, ByCountry }
	export enum ListOrder {ByWeek, ByPrice}

	export class WeekendDisplayer {

			private connections;
			private $cont;

			constructor($cont) {
				this.$cont = $cont;
			}

		public showResults(connections, grouping: LocationGrouping, order: ListOrder) {
			this.connections = connections;
				
			if (grouping === LocationGrouping.ByCity) {

				if (order === ListOrder.ByWeek) {
						var r1 = GroupByCityAndWeek.exe(this.connections);
						var d1 = new ByCityAndWeekDisplay(this.$cont);
						d1.render(r1);
				}
			}

			if (grouping === LocationGrouping.None) {

			}

			if (grouping === LocationGrouping.ByCountry) {

					if (order === ListOrder.ByWeek) {
							var r2 = GroupByCountryAndWeek.exe(this.connections);
							var d2 = new ByCountryAndWeekDisplay(this.$cont);
							d2.render(r2);
					}					
			}
				
		}

	}

	export class GroupByCountryAndWeek {

			private static weekGroups = [];

			public static exe(connections) {
					connections.forEach((connection) => {

							connection.WeekFlights.forEach((weekFlight) => {
									var weekGroup = this.getOrCreateWeekGroup(weekFlight.WeekNo, weekFlight.Year);
									var weekGroupCountry = this.getOrCreateWeekGroupCountry(weekGroup, connection.CountryCode, connection.CountryCode);

									var flightGroup = {
											fromPrice: weekFlight.FromPrice,
											fromAirport: connection.FromAirport,
											toAirport: connection.ToAirport,
											flights: weekFlight.Flights
									};

									if (!weekGroupCountry.fromPrice) {
											weekGroupCountry.fromPrice = weekFlight.FromPrice;
									} else if (weekGroupCountry.fromPrice > weekFlight.FromPrice) {
											weekGroupCountry.fromPrice = weekFlight.FromPrice;
									}

									weekGroupCountry.flightsGroups.push(flightGroup);
							});

					});

					return this.weekGroups;
			}

			private static getOrCreateWeekGroup(week, year) {

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

			private static getOrCreateWeekGroupCountry(weekGroup, countryCode, name) {
					var wgc = _.find(weekGroup.countries, (country) => { return country.countryCode === countryCode });
					if (!wgc) {
							wgc = {
									countryCode: countryCode,
									name: name,
									fromPrice: null,
									flightsGroups: []
							}
							weekGroup.countries.push(wgc);
					}

					return wgc;
			}

	}
		
	export class GroupByCityAndWeek {

		private static weekGroups = [];

		public static exe(connections) {
			connections.forEach((connection) => {

				connection.WeekFlights.forEach((weekFlight) => {
					var weekGroup = this.getOrCreateWeekGroup(weekFlight.WeekNo, weekFlight.Year);
					var weekGroupCity = this.getOrCreateWeekGroupCity(weekGroup, connection.ToCityId, connection.CityName);

					var flightGroup = {
						fromPrice: weekFlight.FromPrice,
						fromAirport: connection.FromAirport,
						toAirport: connection.ToAirport,
						flights: weekFlight.Flights
					};

					if (!weekGroupCity.fromPrice) {
						weekGroupCity.fromPrice = weekFlight.FromPrice;
					} else if (weekGroupCity.fromPrice > weekFlight.FromPrice) {
						weekGroupCity.fromPrice = weekFlight.FromPrice;
					}

					weekGroupCity.flightsGroups.push(flightGroup);
				});

			});

			return this.weekGroups;
		}

		private static getOrCreateWeekGroup(week, year) {

					var weekGroup = _.find(this.weekGroups, (wg) => { return wg.week === week && wg.year === year });
					if (!weekGroup) {
							weekGroup = {
									week: week,
									year: year,
									cities: []
							}
							this.weekGroups.push(weekGroup);
					}

					return weekGroup;
			}

			private static getOrCreateWeekGroupCity(weekGroup, gid, name) {
					var wgc = _.find(weekGroup.cities, (city) => { return city.gid === gid });
					if (!wgc) {
							wgc = {
									gid: gid,
									name: name,
									fromPrice: null,
									flightsGroups: []
							}
							weekGroup.cities.push(wgc);
					}

					return wgc;
			}

	//		var structureExample = [
	//		{
	//									week: 46,
	//									year: 2016,

	//									cities: [
	//						{
	//								gid: 132,
	//								name: "London",
	//								fromPrice: 66,
	//								flightsGroups: [{
	//										fromPrice: 86,
	//										fromAirport: "HHN",
	//										toAirport: "LCY",
	//										flights: []
	//								}]

	//						}
	//									]
	//		}
	//];

	}
		
		//not used, delete before refactor if you don't use it
	export class GroupingUtils {
			private groupToArray(gs) {
					var r = [];
					this.forEachGroup(gs, (key, items) => {
							r.push({ key: key, items: items });
					});
					return r;
			}

			private forEachGroup(gs, callback) {
					for (var key in gs) {
							if (!gs.hasOwnProperty(key)) {
									continue;
							}

							callback(key, gs[key]);
					}
			}
	}

	
}