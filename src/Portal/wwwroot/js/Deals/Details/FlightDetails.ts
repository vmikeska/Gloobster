module Planning {

		export class FlightsOrdering {

				public onChange: Function;

				private $cont;
				private act = "active";

				public orderBy = "price";
				public orderStyle = "asc";

				private setActiveById(id) {
						this.$cont.find(`[data-b="${id}"]`).addClass(this.act);
				}

				private flights;

				public setFlights(flights) {

						if (flights.length > 1) {
							this.$cont.removeClass("hidden");
						}

					this.flights = flights;
				}

				public change() {
					if (this.onChange) {
						var oFlights = [];
							
							//todo: orderStyle can be removed

							if (this.orderBy === "price") {
									oFlights = _(this.flights)
											.chain()
											.sortBy("price")
											.reverse()
											.sortBy("score")
											.reverse()
											.value();	
							}

							if (this.orderBy === "score") {
									oFlights = _(this.flights)
											.chain()
											.sortBy("score")
											.reverse()
											.sortBy("price")
											//.reverse()
											.value();
							}
							

							this.onChange(oFlights);
					}
				}
				
				constructor() {
					this.$cont = $(".deals-ordering");

					var $items = this.$cont.find(".item");

					this.setActiveById(this.orderBy);

					$items.click((e) => {							
							var $t = $(e.target);

							$items.removeClass(this.act);
							$t.addClass(this.act);

							this.orderStyle = $t.data("o");							
							this.orderBy = $t.data("b");		

							this.change();
					});
				}
		}

	export class FlightDetails {

			public get v(): Views.ViewBase {
					return Views.ViewBase.currentView;
			}

				public genFlights($cont, flights: Flight[]) {
						var lg = Common.ListGenerator.init($cont, "connection-flight-template");
						lg.clearCont = true;
						
						lg.listLimit = 20;
						lg.listLimitMoreTmp = "flights-list-more-tmp";
						lg.listLimitLessTmp = "flights-list-less-tmp";

						lg.emptyTemplate = "flights-empty-template";
						lg.customMapping = (i) => {

								var stars = AnytimeAggUtils.getScoreStars(i.score);

								return {
										price: i.price,
										scoreText: this.getScoreText(stars),
										scoreStars: stars,
										bookLink: i.bookLink,
										scoreOk: i.scoreOk
								};
						};

						lg.onItemAppended = ($flightAll, flight) => {
								this.genFlight($flightAll.find(".left"), flight);
						};

						lg.generateList(flights);
				}

				private getScoreText(stars) {
						if (stars === 5 || stars === 4) {
								return "E";
						}
						if (stars === 3 || stars === 2) {
								return "G";
						}
						
						return "S";
				}

				private splitInboundOutboundFlight(flight: Flight) {

						var thereParts = [];
						var backParts = [];

						var thereFinished = false;

						flight.parts.forEach((fp) => {

								if (thereFinished) {
										backParts.push(fp);
								} else {
										thereParts.push(fp);
								}

								if (fp.to === flight.to) {
										thereFinished = true;
								}

						});

						return {
								thereParts: thereParts,
								backParts: backParts
						};
				}


				private genFlight($cont, flight: Flight) {

						var inOut = this.splitInboundOutboundFlight(flight);
						var thereParts = inOut.thereParts;
						var backParts = inOut.backParts;

						var majorFlights = [];
						if (thereParts.length === 1) {
								majorFlights.push(thereParts[0]);
						} else {
								var vt = this.viewForMultiFlight(thereParts);
								majorFlights.push(vt);
						}

					if (backParts.length > 0) {
						if (backParts.length === 1) {
							majorFlights.push(backParts[0]);
						} else {
							var vb = this.viewForMultiFlight(backParts);
							majorFlights.push(vb);
						}
					}

					var lgi = Common.ListGenerator.init($cont, "connection-single-flight-template");
						lgi.customMapping = (f) => {

								if (f.isMulti) {
										return f;
								} else {
										return this.mapSingleFlight(f);
								}
						};

						lgi.evnt(".stops-btn", (e, $multiFlight, $btn, multiFlight) => {

								var $arrow = $btn.find(".icon-dropdown-arrow");

								if (multiFlight.subList) {
										multiFlight.subList.destroy();
										multiFlight.subList = null;
										$arrow.removeClass("opened");
								} else {
										var subFlightsLg = this.genMultiFlightFlights($multiFlight, multiFlight);
										multiFlight.subList = subFlightsLg;
										$arrow.addClass("opened");
								}
						});

						lgi.generateList(majorFlights);
				}

				private genMultiFlightFlights($multiFlight, multiFlight) {

					  var $cont = $multiFlight.find(".flights-sub");

						var lg = Common.ListGenerator.init($cont, "connection-single-flight-template");						
						lg.customMapping = (f) => {
								var res = this.mapSingleFlight(f);
								res.customClass = "sub-part";
								return res;
						};
						
						lg.generateList(multiFlight.parts);

						return lg;
				}

				private viewForMultiFlight(parts: FlightPart[]) {

						var first = _.first(parts);
						var last = _.last(parts);

						var airName = this.v.t("MultiAirlines", "jsDeals");
						var logoLink = "/images/n/airlogos/default-airline.svg";

						var allAirSame = _.every(parts, (p) => { return p.airline === first.airline });
						if (allAirSame) {
								airName = AirlineCodes.getName(first.airline);
								logoLink = this.getLogoLink(first.airline);
						}

						var dur = this.getDurationMulti(first.depTime, last.arrTime);

						var res = {
								isMulti: true,
								parts: parts,
								customClass: "",

								airName: airName,
								logoLink: logoLink,
								codeFrom: first.from,
								codeTo: last.to,
								flightNo: "",
								date: this.getDate(first.depTime),
								timeFrom: this.getTime(first.depTime),
								timeTo: this.getTime(last.arrTime),
								durHours: dur.hours,
								durMins: dur.mins,
								stops: parts.length - 1
						};

						return res;
				}

				private mapSingleFlight(f: FlightPart) {

						var dur = this.getDuration(f.minsDuration);

						var context = {
								customClass: "",

								airName: AirlineCodes.getName(f.airline),
								logoLink: this.getLogoLink(f.airline),
								codeFrom: f.from,
								codeTo: f.to,
								flightNo: f.airline + f.flightNo,
								date: this.getDate(f.depTime),
								timeFrom: this.getTime(f.depTime),
								timeTo: this.getTime(f.arrTime),
								durHours: dur.hours,
								durMins: dur.mins,
								stops: 0
						};

						return context;
				}

				private getDurationMulti(from, to) {
						var diffMs = to - from;
						var diffMins = diffMs / 1000 / 60;
						return this.getDuration(diffMins);
				}


				private getDuration(mins) {
						var h = Math.floor(mins / 60);
						var m = mins % 60;
						return { hours: h, mins: m };
				}

				private getDate(str) {
						var res = moment.utc(str).format("ddd D MMM");
						return res;
				}

				private getTime(str) {
						var m = moment.utc(str);
						//keep this, de, for example has international fly format
						m.locale("de");
						var res = m.format("LT");
						return res;
				}

				private getLogoLink(code) {

						var airs = ["OK", "LX", "4U", "5J", "9U", "9W", "A3", "A5", "A9", "AA", "AB", "AC", "AF", "AK", "AS", "AV", "AY", "AZ", "B2", "B6", "BA", "BE", "BT", "BY", "CA", "CI", "CX", "CZ", "D8", "DE", "DJ", "DL", "DP", "DY", "EI", "EK", "EV", "EW", "F9", "FI", "FL", "FR", "FV", "G3", "GA", "HG", "HQ", "HU", "HV", "IB", "IG", "JJ", "JL", "JP", "JQ", "JT", "JU", "KC", "KE", "KL", "KM", "LA", "LG", "LH", "LO", "LP", "LS", "LU", "MH", "MQ", "MT", "MU", "NH", "NZ", "OA", "OO", "OS", "OU", "OZ", "PC", "PS", "QF", "QR", "QU", "RO", "S7", "SK", "SN", "SQ", "SR", "ST", "SU", "SV", "SW", "TG", "TK", "TO", "TP", "TV", "U2", "U6", "UA", "UT", "UX", "VA", "VN", "VS", "VX", "VY", "W6", "WN", "WS", "X3", "XQ", "YM", "ZH"];
						if (!_.contains(airs, code)) {
								code = "default-airline";
						}

						return `/images/n/airlogos/${code}.svg`;						
				}


		}


}