module Planning {
		
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
		
}