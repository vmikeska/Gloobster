module Planning {

		export class LastItem {
				public static getLast($rootCont, itemClass, blockNo) {

						var $lastBlock;

						var can = true;
						var curBlockNo = blockNo;

						while (can) {
								var nextBlockNo = curBlockNo + 1;

								var $i = this.findByNo($rootCont, itemClass, curBlockNo);
								var $ni = this.findByNo($rootCont, itemClass, nextBlockNo);

								var hasNext = $ni != null;
								if (hasNext) {
										var currentTop = $i.offset().top;
										var nextTop = $ni.offset().top;

										if (currentTop < nextTop) {
												$lastBlock = $i;
												can = false;
										}
								} else {
										$lastBlock = $i;
										can = false;
								}

								curBlockNo++;
						}

						return $lastBlock;
				}

				private static findByNo($rootCont, itemClass, no) {
						var $found = null;
						$rootCont.find(`.${itemClass}`).toArray().forEach((i) => {
								var $i = $(i);
								if (parseInt($i.data("no")) === no) {
										$found = $i;
								}
						});

						return $found;
				}
		}

		export class CityClassicSearch {
				
				private fromDate = this.addDays(new Date(), 1);
				private toDate = this.addDays(this.fromDate, 3);
				private currentFlights = [];

				private depTimeFrom = 0;
				private depTimeTo = 1440;
				private arrTimeFrom = 0;
				private arrTimeTo = 1440;

				private cityDetail: CityDetail;

				private $flightsCont = $(".other-flights-cont");

				constructor(cd: CityDetail) {
						this.cityDetail = cd;
				}

				private addDays(date, days) {
						return moment(date).add(days, "days").toDate();
				}

				public init() {
						this.$flightsCont.empty();

						var $tmp = this.cityDetail.filterLayout("classics-srch-template");

						var $depDate = $tmp.find(".dep .date");
						this.datepicker($depDate, this.fromDate, (d) => {
								this.fromDate = d;
						});

						var $depTime = this.timeSlider($tmp.find(".dep .time"), "depTime", (from, to) => {
								this.depTimeFrom = from;
								this.depTimeTo = to;
								this.filterFlightsTime();
						});

						var $arrDate = $tmp.find(".arr .date");
						this.datepicker($arrDate, this.toDate, (d) => {
								this.toDate = d;
						});

						var $arrTime = this.timeSlider($tmp.find(".arr .time"), "arrTime", (from, to) => {
								this.arrTimeFrom = from;
								this.arrTimeTo = to;
								this.filterFlightsTime();
						});

						$tmp.find("#search").click((e) => {
								e.preventDefault();

								this.genCustomFlights();
						});

				}

				private filterFlightsTime() {						
						this.$flightsCont.empty();

						var flights = _.filter(this.currentFlights, (f) => {

								var first = _.first(f.FlightParts);
								var last = _.last(f.FlightParts);

								var thereMins = this.getDateMinutes(new Date(first.DeparatureTime));
								var depFits = this.timeFits(thereMins, this.depTimeFrom, this.depTimeTo);

								var backMins = this.getDateMinutes(new Date(last.DeparatureTime));
								var arrFits = this.timeFits(backMins, this.arrTimeFrom, this.arrTimeTo);

								return depFits && arrFits;
						});

						this.cityDetail.flightDetails.genFlights(this.$flightsCont, flights);
				}

				private timeFits(time, from, to) {
						return from <= time && to >= time;
				}

				private getDateMinutes(date: Date) {
						return ((date.getHours() - 1) * 60) + date.getMinutes();
				}

				private genCustomFlights() {
						var fromDate = TravelB.DateUtils.myDateToTrans(TravelB.DateUtils.jsDateToMyDate(this.fromDate));
						var toDate = TravelB.DateUtils.myDateToTrans(TravelB.DateUtils.jsDateToMyDate(this.toDate));

						var prms = [
								["ss", "1"],
								["codeFrom", this.cityDetail.codeFrom],
								["codeTo", this.cityDetail.codeTo],
								["dateFrom", fromDate],
								["dateTo", toDate],

								["scoreLevel", ScoreLevel.Standard.toString()]
						];

						this.cityDetail.genFlights(prms, (flights) => {
							this.currentFlights = flights;
						});
				}

				private timeSlider($cont, id, onChange) {
						var ts = new TimeSlider($cont, id);
						ts.onRangeChanged = (from, to) => {
								onChange(from, to);
						};
						ts.genSlider();
						return ts;
				}

				private datepicker($dp, date, callback) {

						$dp.datepicker();
						$dp.datepicker("setDate", date);
						$dp.change((e) => {
								var $this = $(e.target);
								var date = $this.datepicker("getDate");

								callback(date);
						});
				}
		}

	export class CityDetail {

		public flightDetails: FlightDetails;
		private v = Views.ViewBase.currentView;

		public codeFrom;
		public codeTo;
		private cityName;
		private gid;

		public scoreLevel;

		private slider: RangeSlider;
		private monthsSel: MonthsSelector;

		private classicSearch: CityClassicSearch;

		public $layout;

		constructor(scoreLevel, codeFrom, codeTo, cityName, gid) {
			this.flightDetails = new FlightDetails();

			this.scoreLevel = scoreLevel;

			this.codeFrom = codeFrom;
			this.codeTo = codeTo;
			this.cityName = cityName;
			this.gid = gid;				
		}

		public init(flights) {
			flights = _.sortBy(flights, "Price");

			this.flightDetails.genFlights(this.$layout.find(".flights"), flights);

			this.genMonthFlights();
		}

		public destroyLayout() {
			$(".city-deal").remove();
		}

		private initTabs($cont, callback) {
			var $tabs = $cont.find(".tab");

			$cont.find(".tab")
				.click((e) => {
					e.preventDefault();
					var $t = $(e.delegateTarget);

					$tabs.removeClass("active");
					$t.addClass("active");

					var t = $t.data("t");
					callback(t);
				});

		}

		public createLayout($lastBox) {
			this.destroyLayout();

			var cityDealLayout = this.v.registerTemplate("city-deals-template");
			var context = {
				gid: this.gid,
				cityName: this.cityName,
				codeFrom: this.codeFrom,
				codeTo: this.codeTo
			};
			this.$layout = $(cityDealLayout(context));

			$lastBox.after(this.$layout);

			this.initDeals();


			this.initTabs(this.$layout.find(".search-tabs"),
				(t) => {
					this.$layout.find(".tabs-cont").empty();
					this.$layout.find(".other-flights-cont").empty();

					if (t === "deals") {
						this.initDeals();
					}

					if (t === "classic") {
						this.classicSearch = new CityClassicSearch(this);
						this.classicSearch.init();
					}
				});

			this.$layout.find(".close").click((e) => {
					e.preventDefault();
					this.destroyLayout();
				});
		}
			
		public filterLayout(tmpName) {
			var t = this.v.registerTemplate(tmpName);
			var $tmp = $(t());
			this.$layout.find(".tabs-cont").html($tmp);
			return $tmp;
		}

		private initDeals() {
			var $tmp = this.filterLayout("deals-srch-template");

			this.slider = new RangeSlider($tmp.find(".days-range"), "daysRange");
			this.slider.genSlider(1, 21);
			this.slider.onRangeChanged = () => {
				this.genMonthFlights();
			}

			this.monthsSel = new MonthsSelector($tmp.find(".months"));
			this.monthsSel.gen(12);
			this.monthsSel.onChange = () => {
				this.genMonthFlights();
			}
		}

		private preloader(show: boolean) {
			var $p = this.$layout.find(".other-flights-preloader");

			if (show) {
				$p.show();
			} else {
				$p.hide();
			}
		}


		private genMonthFlights() {
			var days = this.slider.getRange();

			var prms = [
				["ss", "0"],
				["codeFrom", this.codeFrom],
				["codeTo", this.codeTo],
				["daysFrom", days.from.toString()],
				["daysTo", days.to.toString()],
				["monthNo", this.monthsSel.month.toString()],
				["yearNo", this.monthsSel.year.toString()],
				["scoreLevel", this.scoreLevel.toString()]
			];

			this.genFlights(prms);
		}

		public genFlights(prms, callback: Function = null) {
			var $ofCont = this.$layout.find(".other-flights-cont");
			$ofCont.empty();

			this.preloader(true);

			this.v.apiGet("SkypickerCity", prms, (fs) => {

					if (callback) {
						callback(fs);
					}

					//fs = _(fs).chain()
					//		.sortBy("FlightScore").reverse()
					//		.sortBy("Price")
					//		.value();		

					fs = _(fs)
						.chain()
						.sortBy("Price")
						.reverse()
						.sortBy("FlightScore")
						.reverse()
						.value();

					this.flightDetails.genFlights($ofCont, fs);

					this.preloader(false);
				});

		}

	}

	export class FlightDetails {

				public genFlights($cont, flights) {
						var lg = Common.ListGenerator.init($cont, "connection-flight-template");
						lg.clearCont = true;
						lg.isAsync = true;
						lg.emptyTemplate = "flights-empty-template";
						lg.customMapping = (i) => {

							var stars = AnytimeAggUtils.getScoreStars(i.FlightScore);

								return {
										price: i.Price,
										scoreText: this.getScoreText(stars),
										scoreStars: stars
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

						return {
								thereParts: thereParts,
								backParts: backParts
						};
				}


				private genFlight($cont, flight) {

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

						if (backParts.length === 1) {
								majorFlights.push(backParts[0]);
						} else {
								var vb = this.viewForMultiFlight(backParts);
								majorFlights.push(vb);
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
						var lg = Common.ListGenerator.init($multiFlight, "connection-single-flight-template");
						lg.appendStyle = "after";
						lg.customMapping = (f) => {
								var res = this.mapSingleFlight(f);
								res.customClass = "sub-part";
								return res;
						};

						lg.generateList(multiFlight.parts);

						return lg;
				}

				private viewForMultiFlight(parts) {

						var first = _.first(parts);
						var last = _.last(parts);

						var airName = "Multi airlines";
						//todo: change to multi
						var logoLink = "/images/n/Examples/SwissAir.svg";

						var allAirSame = _.every(parts, (p) => { return p.Airline === first.Airline });
						if (allAirSame) {
								airName = AirlineCodes.getName(first.Airline);
								logoLink = this.getLogoLink(first.Airline);
						}

						var dur = this.getDurationMulti(new Date(first.DeparatureTime), new Date(last.ArrivalTime));

						var res = {
								isMulti: true,
								parts: parts,
								customClass: "",

								airName: airName,
								logoLink: logoLink,
								codeFrom: first.From,
								codeTo: last.To,
								flightNo: "",
								date: this.getDate(first.DeparatureTime),
								timeFrom: this.getTime(first.DeparatureTime),
								timeTo: this.getTime(last.ArrivalTime),
								durHours: dur.hours,
								durMins: dur.mins,
								stops: parts.length - 1
						};

						return res;
				}

				private mapSingleFlight(f) {

						var dur = this.getDuration(f.MinsDuration);

						var context = {
								customClass: "",

								airName: AirlineCodes.getName(f.Airline),
								logoLink: this.getLogoLink(f.Airline),
								codeFrom: f.From,
								codeTo: f.To,
								flightNo: f.Airline + f.FlightNo,
								date: this.getDate(f.DeparatureTime),
								timeFrom: this.getTime(f.DeparatureTime),
								timeTo: this.getTime(f.ArrivalTime),
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