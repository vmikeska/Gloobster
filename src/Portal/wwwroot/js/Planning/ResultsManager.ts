module Planning {

	export class WeekendDisplay {

		public displayByWeek(connections) {
			var results = this.getByWeek(connections);

			results = _.sortBy(results, "weekNo");

			var $results = $("#results2");
			$results.html("");

			results.forEach((result) => {
				var weekendRange = DateOps.getWeekendRange(result.weekNo);

				var $title = $(`<div style="border-bottom: 1px solid red;"><b>Weekend: ${result.weekNo}.</b> (${DateOps.dateToStr(weekendRange.friday)} - ${DateOps.dateToStr(weekendRange.sunday)})</div>`);
				$results.append($title);

				result.cities = _.sortBy(result.cities, "fromPrice");

				result.cities.forEach((city) => {

					var $city = $(`<div style="border: 1px solid blue; width: 200px; display: inline-block;"><div>To: ${city.name}</div></div>`);

					city.fromToOffers.forEach((fromToOffer) => {
						var $fromTo = $(`<div>${fromToOffer.fromAirport}-${fromToOffer.toAirport} from: ${fromToOffer.fromPrice}</div>`);
						$city.append($fromTo);
					});

					$results.append($city);

				});
			});
		}

		private getByWeek(connections) {

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