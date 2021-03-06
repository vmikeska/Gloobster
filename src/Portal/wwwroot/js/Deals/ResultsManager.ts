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

						this.addPrm("customId", this.customId);

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
						if (notNull(val)) {
								var p = [name, val.toString()];
								this.prms.push(p);
						}
				}

		}

		export class ResultsManager {

				public finishedQueries = [];
				public timeType: PlanningType;
				public onResultsChanged: Function;

				public onDrawQueue: Function;

				public queue = [];
				private intervalId;
				private doRequery = true;
				private lastCustomId = "";

				public maxQueries = 60;

				public refresh() {
						this.initalCall(this.timeType, this.lastCustomId);
				}

				public initalCall(timeType: PlanningType, customId = "") {

						this.lastCustomId = customId;

						this.timeType = timeType;
						this.stopQuerying();
						this.queue = [];
						this.finishedQueries = [];
						this.resultsChanged();

						var request = QueriesBuilder.new()
								.setFirstQuery(true)
								.setTimeType(timeType)
								.setCustomId(customId)
								.build();

						this.getQueries(request);
				}

				public recieveQueries(queries) {
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


				public selectionChanged(id: string, newState: boolean, type: FlightCacheRecordType, customId = "") {

						this.lastCustomId = customId;

						if (newState) {
								this.drawQueue();

								var qb = QueriesBuilder.new()
										.setTimeType(this.timeType)
										.setCustomId(customId);

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
						this.stopQuerying();
						Views.ViewBase.currentView.apiGet("Deals", params, (queries) => {
								this.recieveQueries(queries);
						});
				}

				private resultsChanged() {
						if (this.onResultsChanged) {
								this.onResultsChanged(this.finishedQueries);
						}
				}

				//todo: maybe start/stop querying can be replaced by simple recursion ?

				private stopQuerying() {
						if (this.intervalId) {
								clearInterval(this.intervalId);
						}
				}

				private startQuerying() {

						this.drawQueue();

						if (!this.doRequery) {
								return;
						}

						this.intervalId = setInterval(() => {
								this.drawQueue();

								if (this.queue.length === 0) {
										this.stopQuerying();
								}

								var qb = QueriesBuilder.new()
										.setTimeType(this.timeType);




								if (this.queue.length > this.maxQueries) {

										for (var act = 0; act <= this.maxQueries - 1; act++) {
												var q = this.queue[act];
												qb.addQID(q.qid);
										}

								} else {
										this.queue.forEach((q) => {
												qb.addQID(q.qid);
										});
								}



								var prms = qb.build();

								this.getQueries(prms);
						},
								3000);
				}

				private drawQueue() {

						if (this.onDrawQueue) {
								this.onDrawQueue();
						}

				}

		}

		export class QueueVisualize {
				private $rootCont;
				private $mainCont;
				private $cont;

				private itemTmp;

				constructor($rootCont) {
						this.$rootCont = $rootCont;
						this.$mainCont = this.$rootCont.find(".cat-queue");
						this.$cont = this.$mainCont.find(".cont");

						this.itemTmp = Views.ViewBase.currentView.registerTemplate("queue-item-tmp");
				}

				public draw(timeType, queries) {

						this.$cont.empty();

					this.$cont.append(`<span class="queue-txt">Search queue:</span>`);

						var maxItems = 7;
						var qd = queries;
						var shrinkQueue = qd.length > maxItems;

						var origSize = qd.length;

						if (shrinkQueue) {
								qd = qd.slice(0, maxItems);
						}

						var itemsCut = origSize - qd.length;

						var v = Views.ViewBase.currentView;

						qd.forEach((query) => {

								var prmsTxt = "";

								if (timeType === PlanningType.Weekend) {
										var dates = ParamsParsers.weekend(query.prms);
										prmsTxt = `(${dates.week}. ${v.t("WeekNo", "jsDeals")}, ${dates.year})`;
								}
								
								var text = `${query.from} - ${query.toName} ${prmsTxt}`;
								var context = {
										text: text
								};

								var $itm = this.itemTmp(context);

								this.$cont.append($itm);
						});

						if (shrinkQueue) {
								this.$cont.append(`<span>+ ${itemsCut} more</span>`);
						}

						if (qd.length > 0) {
								this.$mainCont.removeClass("hidden");
						}
				}

				public hide() {
						this.$cont.empty();
						this.$mainCont.addClass("hidden");
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