module Planning {
		
		export class WeekendByCountryAgg extends WeekendAggBase {

				private weekGroups = [];

				public exe(connections, days, starsLevel) {
						connections.forEach((c) => {

								c.WeekFlights.forEach((weekFlight) => {

										var flights = this.fittingFlights(weekFlight.Flights, days, starsLevel);

									if (any(flights)) {
											var weekGroup = this.getOrCreateWeekGroup(weekFlight.WeekNo, weekFlight.Year);
											var country = this.getOrCreateCountry(weekGroup, c.CountryCode, c.CountryCode);
											var city = this.getOrCreateCity(c.ToCityId, c.CityName, country);

											var lowestPrice = this.getLowestPrice(flights);

											var flightGroup = {
													fromPrice: lowestPrice,
													fromAirport: c.FromAirport,
													toAirport: c.ToAirport,
													flights: flights
											};

											if (!country.fromPrice) {
													country.fromPrice = lowestPrice;
											} else if (country.fromPrice > lowestPrice) {
													country.fromPrice = lowestPrice;
											}

											if (!city.fromPrice) {
													city.fromPrice = lowestPrice;
											} else if (city.fromPrice > lowestPrice) {
													city.fromPrice = lowestPrice;
											}

											city.flightsGroups.push(flightGroup);

										}
																				
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


		
}