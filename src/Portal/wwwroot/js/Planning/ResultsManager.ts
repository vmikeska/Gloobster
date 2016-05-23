module Planning {
	export class ResultsManager {

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

								this.appendResult(result);								
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

						if (this.queue.length === 0) {
								this.stopQuerying();
						}

						var prms = this.buildQueueParams(this.queue);
						this.getQueries(prms);
				}, 3000);
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

		private appendResult(result) {
			result.Connections.forEach((conn) => {
				var $item = $(`<div style="width: 200px: display: inline-block;"><div style="border: 1px solid red">From: ${result.From}, To: ${result.To}</div></div>`);
				conn.WeekFlights.forEach((group) => {
					var $week = $(`<div>FromPrice: ${group.FromPrice}, WeekNo: ${group.WeekNo}</div>`);
					$item.append($week);
				});

				$("#results").append($item);
			});				
		}

		public selectionChanged(id: string, newState: boolean, type: FlightCacheRecordType) {
				//todo: unselecting implement
				this.getQueries([["p", `${id}-${type}`]]);
		}
			
		
	}
}

//public class WeekendSearchResultDO {
//		public string From { get; set; }
//    public string To { get; set; }
//    public FlightCacheRecordType Type { get; set; }

//    public bool NotFinishedYet { get; set; }
//    public bool QueryStarted { get; set; }

//    public List < WeekendConnectionDO > Connections { get; set; }
//}