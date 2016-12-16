module Planning {

		export class QueriesBuilder {

				public prms = [];

				private firstQuery = false;
				private timeType: PlanningType;
				private customId: string;

				private ccs = [];
				private gids = [];
				private qids = [];

				public static new(): QueriesBuilder {
					return new QueriesBuilder();
				}

			public addCC(cc: string) {
				this.ccs.push(cc);
				return this;
			}

			public addGID(gid: number) {
						this.gids.push(gid);
						return this;
				}

				public addQID(qid: string) {
						this.qids.push(qid);
						return this;
				}


				public setFirstQuery(state: boolean) {
						this.firstQuery = state;

					return this;
				}

				public setTimeType(val: PlanningType) {
						this.timeType = val;

					return this;
				}

				public setCustomId(val: string) {
						this.customId = val;

					return this;
				}


			public build() {

				this.addPrm("timeType", this.timeType);

				this.addPrm("firstQuery", this.firstQuery);

				if (this.firstQuery) {
					return this.prms;
				}

				this.ccs.forEach((cc) => {
					this.addPrm("ccs", cc);
				});

				this.gids.forEach((gid) => {
					this.addPrm("gids", gid);
				});

				this.qids.forEach((qid) => {
					this.addPrm("qids", qid);
				});

				return this.prms;
			}

			private addPrm(name: string, val) {
						var p = [name, val.toString()];
					this.prms.push(p);
				}
				
		}

	export class ResultsManager {

		public finishedQueries = [];

		public onResultsChanged: Function;

		private queue = [];
		private intervalId;
		private doRequery = true;

		public timeType: PlanningType;

		public refresh() {
				this.initalCall(this.timeType);
		}

		public initalCall(timeType: PlanningType) {
			this.timeType = timeType;
			this.stopQuerying();
			this.queue = [];
			this.finishedQueries = [];

			var request = QueriesBuilder.new()
					.setFirstQuery(true)
					.setTimeType(timeType)
					.build();

			this.getQueries(request);
		 }

		public recieveQueries(queries) {
				console.log("receiving results");
				this.stopQuerying();

				var newResults = false;

				queries.forEach((query) => {

						if (query.state === QueryState.Failed) {
								this.removeFromQueue(query.qid);								
						}

						if (query.state === QueryState.Finished) {
								this.addToFinished(query);
								
								newResults = true;
						}

						if (query.state === QueryState.Saved || query.state === QueryState.Started) {
							this.addToQueue(query);
						}
						
				});

				this.drawQueue();

				if (newResults) {
						this.resultsChanged();
				}

				if (this.queue.length > 0) {
						this.startQuerying();
				}
		}

		private addToQueue(query) {
			var exists = _.find(this.queue, (item) => { return item.qid === query.qid; });
			if (exists) {
				return;
			}

			this.queue.push(query);
		}

		private addToFinished(query) {
			this.finishedQueries.push(query);
			this.removeFromQueue(query.qid);
		}

		private removeFromQueue(id) {
			this.queue = _.reject(this.queue, (item) => { return item.qid === id; });
		}

		public selectionChanged(id: string, newState: boolean, type: FlightCacheRecordType) {

				if (newState) {
						this.drawQueue();

					var qb = QueriesBuilder.new()
						.setTimeType(this.timeType);

						if (type === FlightCacheRecordType.City) {
							qb.addGID(parseInt(id));
					  }
						if (type === FlightCacheRecordType.Country) {
								qb.addCC(id);
						}
					 var prms = qb.build();
						
					 this.getQueries(prms);
				} else {
						this.finishedQueries = _.reject(this.finishedQueries, (c) => { return c.to === id; });
						this.resultsChanged();						
				}
		}

		private getQueries(params) {
				console.log("Getting queries");
				Views.ViewBase.currentView.apiGet("Deals", params, (queries) => {
						this.recieveQueries(queries);
				});
		}
			
		private resultsChanged() {
				if (this.onResultsChanged) {
						this.onResultsChanged(this.finishedQueries);
				}	
		}

		private stopQuerying() {
				if (this.intervalId) {
						clearInterval(this.intervalId);
						console.log("Querying stopped");
				}
		}
			
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

				var qb = QueriesBuilder.new()
						.setTimeType(this.timeType);
					
				this.queue.forEach((q) => {
					qb.addQID(q.qid);
				});
				
				var prms = qb.build();
					
				this.getQueries(prms);
			}, 3000);
		}

		private drawQueue() {
			var $queue = $("#queue");

			if (this.queue.length > 0) {
				$queue.html(`<div style="display: inline-block;">Queue: <img class="loader" src="/images/loader-gray.gif"/></div>`);
			} else {
				$queue.html("");
			}

			this.queue.forEach((query) => {
					
					var prmsTxt = "";

					if (this.timeType === PlanningType.Weekend) {
							var dates = ParamsParsers.weekend(query.prms);
							prmsTxt = `(${dates.week}. week, ${dates.year})`;
					}

					if (this.timeType === PlanningType.Custom) {
							//todo:
					}
					
					$queue.append(`<div style="display: inline-block; border: 1px solid red;">${query.from} - ${query.toName}${prmsTxt}</div>`);

			});
		}

		}

		export class ParamsParsers {
			public static weekend(prms) {
				var ps = prms.split("_");
				return {
					week: ps[0],
					year: ps[1]
				};
			}
				
			public static custom(prms) {
				var ps = prms.split("_");
				return {
					userId: ps[0],
					searchId: ps[1]
				};
			}

		}
	
}