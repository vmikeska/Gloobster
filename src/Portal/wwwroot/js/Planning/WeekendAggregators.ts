module Planning {

	export enum LocationGrouping { ByCity, ByCountry, ByContinent }
	
	export class WeekendDisplayer {

		private connections;
		private $cont;

		constructor($cont) {
			this.$cont = $cont;
		}

		public showResults(connections, grouping: LocationGrouping) {
			this.connections = connections;

			if (grouping === LocationGrouping.ByCity) {					
					var agg1 = new GroupByCity();
					var r1 = agg1.exe(this.connections);
					var d1 = new ByCityDisplay(this.$cont);
					d1.render(r1);									
			}
				
			if (grouping === LocationGrouping.ByCountry) {					
					var agg2 = new GroupByCountry();
					var r2 = agg2.exe(this.connections);
					var d2 = new ByCountryDisplay(this.$cont);
					d2.render(r2);
				}
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
		
	export class GroupByCity {

		private weekGroups = [];

		public exe(connections) {
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

		private getOrCreateWeekGroup(week, year) {

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

			private getOrCreateWeekGroupCity(weekGroup, gid, name) {
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