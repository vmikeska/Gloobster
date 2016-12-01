module Planning {

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