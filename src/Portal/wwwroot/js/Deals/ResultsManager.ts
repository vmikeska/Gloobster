module Planning {
		
	export class ResultsManager {

		public connections = [];

		public onConnectionsChanged: Function;

		private queue = [];
		private intervalId;

		private timeType;

		public initalCall(timeType) {
			this.timeType = timeType;
			this.stopQuerying();
			this.queue = [];
			this.connections = [];
			this.getQueries([["tt", timeType]]);
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

				var newConnections = false;

				results.forEach((result) => {

						if (result.NotFinishedYet) {
								//nothing
						} else if (result.QueryStarted) {
								this.queue.push({ from: result.From, to: result.To, type: result.Type });
						} else {

								//console.log(`queue length: ${this.queue.length}`);
								this.queue = _.reject(this.queue, (qi)=> { return qi.from === result.From && qi.to === result.To; });
								//console.log(`queue length: ${this.queue.length}`);

								this.drawQueue();

								this.connections = this.connections.concat(result.Result);
								newConnections = true;
						}

				});

				if (newConnections) {
					this.connectionsChanged();
				}

				if (this.queue.length > 0) {
						this.startQuerying();
				}
		}

		private connectionsChanged() {
				if (this.onConnectionsChanged) {
						this.onConnectionsChanged(this.connections);
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
				strParams.push(["tt", this.timeType]);
				return strParams;
		}

		public selectionChanged(id: string, newState: boolean, type: FlightCacheRecordType) {

			if (newState) {
				this.drawQueue();

				this.getQueries([["p", `${id}-${type}`], ["tt", this.timeType]]);
			} else {
				if (type === FlightCacheRecordType.Country) {
						this.connections = _.reject(this.connections, (c) => { return c.CountryCode === id; });
						this.connectionsChanged();
				}
				//todo: unselecting implement city
			}
		}


	}


	
}