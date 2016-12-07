module Planning {

		export class WeekendAggBase {
				protected fittingFlights(fs, days, starsLevel) {
						var flights = [];

						fs.forEach((f) => {

								var daysOk = this.fitsByDays(f, days);

								var scoreOk = AnytimeAggUtils.checkFilter(f, starsLevel);

								var valid = daysOk && scoreOk;
								if (valid) {
										flights.push(f);
								}

						});

						return flights;
				}

				protected fitsByDays(f, days) {

						if (!days) {
							return true;
						}

						var parts = this.splitInboundOutboundFlight(f.FlightParts, f.To);
						var first = _.first(parts.thereParts);
						var last = _.last(parts.backParts);

						var from = new Date(first.DeparatureTime);
						var until = new Date(last.ArrivalTime);

						var fDay = this.convDayNo(from.getDay());
						var tDay = this.convDayNo(until.getDay());

						var fDayOk = days.from === fDay;
						var tDayOk = days.to === tDay;

						var valid = fDayOk && tDayOk;
						return valid;
				}

				protected getLowestPrice(flights) {
						var ps = _.map(flights, (f) => { return f.Price; });
						return _.min(ps);
				}

				protected convDayNo(orig) {
						if (orig === 0) {
								return 7;
						}
						return orig;
				}
				
				protected  splitInboundOutboundFlight(parts, to) {

						var thereParts = [];
						var backParts = [];

						var thereFinished = false;

						parts.forEach((fp) => {

								if (thereFinished) {
										backParts.push(fp);
								} else {
										thereParts.push(fp);
								}

								if (fp.To === to) {
										thereFinished = true;
								}

						});

						return {
								thereParts: thereParts,
								backParts: backParts
						};
				}
		}


		export class WeekendByCityAgg extends WeekendAggBase {

				private weekGroups = [];

				public exe(connections, days, starsLevel) {
						
						connections.forEach((connection) => {

								connection.WeekFlights.forEach((weekFlight) => {

									  var flights = this.fittingFlights(weekFlight.Flights, days, starsLevel);

										if (any(flights)) {
												
												var weekGroup = this.getOrCreateWeekGroup(weekFlight.WeekNo, weekFlight.Year);
												var weekGroupCity = this.getOrCreateWeekGroupCity(weekGroup, connection.ToCityId, connection.CityName);

											  var lowestPrice = this.getLowestPrice(flights);

												var flightGroup = {
														fromPrice: lowestPrice,
														fromAirport: connection.FromAirport,
														toAirport: connection.ToAirport,
														flights: flights
												};

												if (!weekGroupCity.fromPrice) {
														weekGroupCity.fromPrice = lowestPrice;
												} else if (weekGroupCity.fromPrice > lowestPrice) {
														weekGroupCity.fromPrice = lowestPrice;
												}

												weekGroupCity.flightsGroups.push(flightGroup);

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


		
}