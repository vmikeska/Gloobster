module Planning {

	export class WeekendByWeekDisplay {

		private weekendByWeekAggregator: WeekendByWeekAggregator;

		private $cont;

		constructor() {
			this.weekendByWeekAggregator = new WeekendByWeekAggregator();
			this.$cont = $("#results2");
		}

		public displayByWeek(connections) {
			var weeks = this.weekendByWeekAggregator.getByWeek(connections);

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

	//string From
  //string To 
  //double Price
  //int Connections
  //double HoursDuration 
  //double FlightScore 
  //List <FlightPartDO> FlightParts
  //string FlightPartsStr

	export class WeekendByWeekAggregator {
			public getByWeek(connections) {

					var groupByDestCity = _.groupBy(connections, 'ToCityId');

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

//WeekendConnectionDO 
//		string FromAirport
//    string ToAirport
//    string ToMapId
//    List <WeekendGroupDO> WeekFlights

//WeekendGroupDO 
//		int WeekNo
//    int Year
//    List <FlightDO> Flights
//    double FromPrice

	export class ResultsManager {

		public connections = [];

		public onConnectionsChanged: Function;

		private queue = [];
		private intervalId;

		public initalCall() {
				this.getQueries([]);
		}

		private getQueries(params) {
				console.log("Getting queries");
				Views.ViewBase.currentView.apiGet("SearchFlights", params, (results) => {
						this.recieveResults(results);
				});
		}

		public recieveResults(results) {
				console.log("receiving results");
				this.stopQuerying();
				
				results.forEach((result) => {

						if (result.NotFinishedYet) {
								//nothing
						} else if (result.QueryStarted) {
								this.queue.push({ from: result.From, to: result.To, type: result.Type });
						} else {

								console.log("queue length: " + this.queue.length);
								this.queue = _.reject(this.queue, (qi)=> { return qi.from === result.From && qi.to === result.To; });
								console.log("queue length: " + this.queue.length);

								this.drawQueue();

								this.connections = this.connections.concat(result.Connections);
								if (this.onConnectionsChanged) {
									this.onConnectionsChanged(this.connections);
								}								
						}

				});

				if (this.queue.length > 0) {
						this.startQuerying();
				}
		}

		private stopQuerying() {
				if (this.intervalId) {
						clearInterval(this.intervalId);
						console.log("Querying stopped");
				}
		}

		private doRequery = true;

		private startQuerying() {

			if (!this.doRequery) {
				return;
			}

			this.intervalId = setInterval(() => {
				console.log("Querying started");

				this.drawQueue();

				if (this.queue.length === 0) {
					this.stopQuerying();
				}

				var prms = this.buildQueueParams(this.queue);
				this.getQueries(prms);
			}, 3000);
		}

		private drawQueue() {
				var $queue = $("#queue");

				if (this.queue.length > 0) {
					$queue.html(`<div>Queue: <img class="loader" src="/images/loader-gray.gif"/></div>`);
				} else {
						$queue.html("");	
				}
				
				this.queue.forEach((i) => {
						$queue.append(`<div style="display: inline; width: 50px; border: 1px solid red;">${i.from}-->${i.to}</div>`);
				});					
			}

		private buildQueueParams(queue) {
				var strParams = [];
				var i = 0;
				queue.forEach((itm) => {
						strParams.push([`q`, `${itm.from}-${itm.to}-${itm.type}`]);
						i++;
				});
				return strParams;
		}
			
		public selectionChanged(id: string, newState: boolean, type: FlightCacheRecordType) {
				//todo: unselecting implement

				this.drawQueue();

				this.getQueries([["p", `${id}-${type}`]]);				
		}
			
		
	}
}