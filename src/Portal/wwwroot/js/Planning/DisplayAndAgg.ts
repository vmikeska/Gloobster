module Planning {

		export class WeekendByWeekAggregator {
				public getByWeek(connections) {

						var groupByDestCity = _.groupBy(connections, "ToCityId");

						var results = [];

						for (var cityKey in groupByDestCity) {
								if (!groupByDestCity.hasOwnProperty(cityKey)) {
										continue;
								}

								var cityGroup = groupByDestCity[cityKey];

								cityGroup.forEach((connection) => {

										connection.WeekFlights.forEach((weekFlightsGroup) => {

												var fromPrice = weekFlightsGroup.FromPrice;

												var weekResult = this.getOrCreateWeekResult(results, weekFlightsGroup.WeekNo);
												var city = this.getOrCreateCityResult(weekResult.cities, connection.ToMapId, connection.CityName);
												if (!city.fromPrice) {
														city.fromPrice = fromPrice;
												} else if (city.fromPrice > fromPrice) {
														city.fromPrice = fromPrice;
												}

												var fromToOffer = { fromAirport: connection.FromAirport, toAirport: connection.ToAirport, fromPrice: fromPrice };
												city.fromToOffers.push(fromToOffer);
										});


								});
						}

						return results;
				}

				private getOrCreateCityResult(cities, toPlace, name) {
						var city = _.find(cities, (c) => {
								return c.toPlace === toPlace;
						});

						if (!city) {
								city = { fromToOffers: [], toPlace: toPlace, name: name };
								cities.push(city);
						}

						return city;
				}

				private getOrCreateWeekResult(results, weekNo) {
						var result = _.find(results, (result) => {
								return result.weekNo === weekNo;
						});

						if (!result) {
								result = {
										weekNo: weekNo,
										cities: []
								};
								results.push(result);
						}

						return result;
				}
		}

		export class WeekendByWeekDisplay {

				private aggregator: WeekendByWeekAggregator;

				private $cont;

				constructor($cont) {
						this.aggregator = new WeekendByWeekAggregator();
						this.$cont = $cont;
				}

				public render(connections) {
						var weeks = this.aggregator.getByWeek(connections);

						weeks = _.sortBy(weeks, "weekNo");

						this.$cont.html("");

						weeks.forEach((week) => {
								var $week = this.genWeek(week);
								this.$cont.append($week);
						});
				}

				private genWeek(week) {
						var weekendRange = DateOps.getWeekendRange(week.weekNo);

						var $week = $(`<div class="weekCont"></div>`);
						var $title = $(`<div style="border-bottom: 1px solid red;"><b>Weekend: ${week.weekNo}.</b> (${DateOps.dateToStr(weekendRange.friday)} - ${DateOps.dateToStr(weekendRange.sunday)})</div>`);
						$week.append($title);

						week.cities = _.sortBy(week.cities, "fromPrice");

						week.cities.forEach((city) => {
								var $city = this.genCity(city, week.weekNo);
								$week.append($city);
						});

						$week.append(`<div class="fCont"></div>`);

						return $week;
				}

				private genCity(city, weekNo) {
						var $city = $(`<div style="border: 1px solid blue; width: 250px; display: inline-block;"><div>To: ${city.name}</div></div>`);

						city.fromToOffers.forEach((offer) => {
								var $fromTo = this.genFromTo(offer, weekNo);
								$city.append($fromTo);
						});

						return $city;
				}

				private genFromTo(item, weekNo) {
						var $fromTo = $(`<div>${item.fromAirport}-${item.toAirport} from: eur ${item.fromPrice} <a data-wn="${weekNo}" data-f="${item.fromAirport}" data-t="${item.toAirport}" href="#">see flights</a></div>`);
						$fromTo.find("a").click((e) => {
								e.preventDefault();
								var $target = $(e.target);
								var weekNo = $target.data("wn");
								var from = $target.data("f");
								var to = $target.data("t");
								this.displayFlights($target, weekNo, from, to);
						});
						return $fromTo;
				}

				private displayFlights($target, weekNo, from, to) {
						var data = [["weekNo", weekNo], ["from", from], ["to", to]];
						Views.ViewBase.currentView.apiGet("GetFlights", data, (flights) => {
								var $flights = this.genFlights(flights);
								var $cont = $target.closest(".weekCont").find(".fCont");
								$cont.html($flights);

								var $aClose = $(`<a href="#">Close</a>`);
								$aClose.click((e) => {
										e.preventDefault();
										$cont.html("");
								});

								$cont.prepend($aClose);
						});
				}

				private genFlights(flights) {
						var $cont = $(`<div></div>`);

						flights.forEach((flight) => {
								var $flight = this.genFlightItem(flight);
								$cont.append($flight);
						});

						return $cont;
				}

				private genFlightItem(flight) {
						var $flight = $(`<table><tr><td colspan="2"></td></tr></table>`);
						$flight.append(this.getLine("Price", flight.Price));
						$flight.append(this.getLine("Connections", flight.Connections));
						$flight.append(this.getLine("HoursDuration", flight.HoursDuration));
						$flight.append(this.getLine("FlightScore", flight.FlightScore));
						$flight.append(this.getLine("FlightPartsStr", flight.FlightPartsStr));
						return $flight;
				}

				private getLine(cap, val) {
						var $row = $(`<tr><td>${cap}</td><td>${val}</td></tr>`);
						return $row;
				}


		}


	export class AnytimeAggregator {

		private splitInboundOutboundFlight(flight) {

			var thereParts = [];
			var backParts = [];

			var thereFinished = false;

			flight.FlightParts.forEach((fp) => {

				if (thereFinished) {
					backParts.push(fp);
				} else {
					thereParts.push(fp);
				}

				if (fp.To === flight.To) {
					thereFinished = true;
				}

			});

			flight.thereParts = thereParts;
			flight.backParts = backParts;
		}


		public aggregate(connections, daysFrom = null, daysTo = null) {

			connections.forEach((c) => {
				c.Flights.forEach((f) => {
					this.splitInboundOutboundFlight(f);
				});
			});
			
			var groupByDestCity = _.groupBy(connections, "ToCityId");

			var results = [];

			for (var cityKey in groupByDestCity) {
				if (!groupByDestCity.hasOwnProperty(cityKey)) {
					continue;
				}

				var cityGroup = groupByDestCity[cityKey];

				var city = cityGroup[0];
	
				var outConns = [];
				cityGroup.forEach((conn) => {
					var c = {
							fromAirport: conn.FromAirport,
							toAirport: conn.ToAirport,
							fromPrice: null,
							flights: []
					};

					var passedFlights = [];
					conn.Flights.forEach((flight) => {
						var did = flight.DaysInDestination;

						var fits = daysFrom === null || ((did >= daysFrom) && (did <= daysTo));
						if (fits) {
							passedFlights.push(flight);
						}

					});					

					if (passedFlights.length > 0) {
							c.flights = passedFlights;
							c.fromPrice = _.min(_.map(passedFlights, (c) => { return c.Price }));
							outConns.push(c);
					}
						
				});

				var cityHasAnyConns = (outConns.length > 0);
				if (cityHasAnyConns) {

						var fromPrice = _.min(_.map(outConns, (c) => { return c.fromPrice }));

					var result = {
						name: city.CityName,
						gid: cityKey,
						conns: cityGroup,
						fromPrice: fromPrice
					};

					result.conns = outConns;

					results.push(result);
				}
			}

			return results;
		}
	}
	
	export class WeekendByCityDisplay {
		private aggregator: WeekendByCityAggregator;

		private $cont;

		constructor($cont) {
			this.aggregator = new WeekendByCityAggregator();
			this.$cont = $cont;
		}

		public render(connections) {
			var cities = this.aggregator.getByCity(connections);

			cities = _.sortBy(cities, "fromPrice");

			cities.forEach((city) => {
				var $city = this.genCity(city);
				this.$cont.append($city);
			});

		}

		private genCity(city) {
			var $city = $(`<div style="border: 1px solid blue; width: 250px; display: inline-block;"><div>To: ${city.name}</div><div>FromPrice: ${city.fromPrice}</div></div>`);
			return $city;
		}
	}

		export class WeekendByCountryDisplay {
			private aggregator: WeekendByCountryAggregator;

			private $cont;

			constructor($cont) {
					this.aggregator = new WeekendByCountryAggregator();
					this.$cont = $cont;
			}

			public render(connections) {
					var cs = this.aggregator.getByCountry(connections);
					cs = _.sortBy(cs, "fromPrice");

					cs.forEach((city) => {
							var $c = this.genCountry(city);
							this.$cont.append($c);
					});
			}

			private genCountry(c) {
					var $c = $(`<div style="border: 1px solid blue; width: 250px; display: inline-block;"><div>To: ${c.name}</div><div>FromPrice: ${c.fromPrice}</div></div>`);
					return $c;
			}
	}

	export class WeekendByCityAggregator {
		public getByCity(connections) {

			var groupByDestCity = _.groupBy(connections, 'ToCityId');

			var results = [];

			for (var cityKey in groupByDestCity) {
				if (!groupByDestCity.hasOwnProperty(cityKey)) {
					continue;
				}

				var cityGroup = groupByDestCity[cityKey];

				var city = cityGroup[0];
				var result = { name: city.CityName, gid: city.ToCityId, fromPrice: null };
				
				cityGroup.forEach((connection) => {
						
					connection.WeekFlights.forEach((weekFlightsGroup) => {

						var fromPrice = weekFlightsGroup.FromPrice;

						if (!result.fromPrice) {
								result.fromPrice = fromPrice;
						} else if (result.fromPrice > fromPrice) {
								result.fromPrice = fromPrice;
						}

						//var fromToOffer = { fromAirport: connection.FromAirport, toAirport: connection.ToAirport, fromPrice: fromPrice };
						//city.fromToOffers.push(fromToOffer);
					});
						
				});
					
				results.push(result);
			}

			return results;
		}
	}

	
	export class WeekendByCountryAggregator {
			public getByCountry(connections) {

					var groups = _.groupBy(connections, 'CountryCode');

					var results = [];

					for (var key in groups) {
							if (!groups.hasOwnProperty(key)) {
									continue;
							}

							var group = groups[key];
							
							var result = { name: key, fromPrice: null };

							group.forEach((connection) => {

									connection.WeekFlights.forEach((weekFlightsGroup) => {

											var fromPrice = weekFlightsGroup.FromPrice;

											if (!result.fromPrice) {
													result.fromPrice = fromPrice;
											} else if (result.fromPrice > fromPrice) {
													result.fromPrice = fromPrice;
											}
									});

							});

							results.push(result);
					}

					return results;
			}
	}

	export class DateOps {
		public static dateToStr(date) {
			var yyyy = date.getFullYear().toString();
			var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
			var dd = date.getDate().toString();
			return `${dd}.${mm}.${yyyy}`;
		}

		public static getWeekendRange(weekNo) {
			var year = 2016;
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