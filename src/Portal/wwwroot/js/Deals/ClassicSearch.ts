module Planning {

		export class FlightsFilter {
				private depTimeFrom = 0;
				private depTimeTo = 1440;
				private arrTimeFrom = 0;
				private arrTimeTo = 1440;

				private airSel: AirportSelector;
				private hasMoreConns: boolean;

				private lastStopCats;

				private search: ClassicSearch;


				constructor(search: ClassicSearch) {
						this.search = search;
				}

				public create() {

						var $c = $("#filterCont");

						var t = Views.ViewBase.currentView.registerTemplate("classic-search-filter-tmp");
						$c.html(t());

						var $f = $(".filter-bar");

						this.lastStopCats = this.countStopCats();

						this.genStopsFilter();

						var $depTime = this.timeSlider($f.find(".dep-time-filter"),
								"depTime",
								(from, to) => {
										this.depTimeFrom = from;
										this.depTimeTo = to;
										this.execFilter();
								});

						var $arrTime = this.timeSlider($f.find(".arr-time-filter"),
								"arrTime",
								(from, to) => {
										this.arrTimeFrom = from;
										this.arrTimeTo = to;
										this.execFilter();
								});

						var $airFilterAll = $f.find(".air-filter-all");
						var $connsFilterCol = $f.find("#connsFilterCol");
						
						var pairs: CodePair[] = [];
						this.search.lastFlights.forEach((f) => {
								var pair = { from: f.from, to: f.to };

								var hasPair = _.find(pairs, (p) => { return p.from === pair.from && p.to === pair.to; });
								if (!hasPair) {
										pairs.push(pair);
								}
						});

						this.hasMoreConns = pairs.length > 1;

						$connsFilterCol.toggleClass("hidden", !this.hasMoreConns);

						if (this.hasMoreConns) {
								this.airSel = new AirportSelector($airFilterAll.find(".air-filter-cont"), pairs);
								this.airSel.onChange = () => {
										this.execFilter();
								}
								this.airSel.init();
						}

						$f.toggleClass("hidden", false);
				}

				private showTotalResults(cnt) {
						$("#foundFlightsAll").removeClass("hidden");
						$("#flightsFound").html(cnt);
				}

				private getDateMinutes(date: Date) {
						return ((date.getHours() - 1) * 60) + date.getMinutes();
				}

				private timeSlider($cont, id, onChange) {
						var ts = new TimeSlider($cont, id);
						ts.onRangeChanged = (from, to) => {
								onChange(from, to);
						};
						ts.genSlider();
						return ts;
				}

				private timeFits(time, from, to) {
						return from <= time && to >= time;
				}

				private countStops(f, justOneway) {
						var parts = f.parts.length;
						var stops = parts;
						if (!justOneway) {
								stops--;
						}
						stops--;

						return stops;
				}

				private execFilter() {
						this.search.majorPreloader(true);

						setTimeout(() => {
								this.processFilter();
								this.search.majorPreloader(false);
						},
								200);
				}

				private processFilter() {

						var flights = _.filter(this.search.lastFlights,
								(f: Flight) => {

										var first = _.first(f.parts);
										var last = _.last(f.parts);

										var thereMins = this.getDateMinutes(first.depTime);
										var depFits = this.timeFits(thereMins, this.depTimeFrom, this.depTimeTo);

										var backMins = this.getDateMinutes(last.depTime);
										var arrFits = this.timeFits(backMins, this.arrTimeFrom, this.arrTimeTo);

										var stopsOk = false;
										var stops = this.countStops(f, this.search.lastJustOneway);
										if (stops === 0 && $("#sfcb_1").prop("checked")) {
												stopsOk = true;
										} else if (stops === 1 && $("#sfcb_2").prop("checked")) {
												stopsOk = true;
										} else if (stops >= 2 && $("#sfcb_3").prop("checked")) {
												stopsOk = true;
										}

										var codeOk = true;
										if (this.hasMoreConns) {
												var actCodePairs = this.airSel.getActive();
												codeOk = _.find(actCodePairs, (p) => { return p.from === f.from && p.to === f.to });
										}

										return depFits && arrFits && codeOk && stopsOk;
								});

						this.showTotalResults(flights.length);

						this.search.$results.empty();
						this.search.flightDetail.genFlights(this.search.$results, flights);
				}

				private countStopCats() {
						var direct = { cnt: 0, from: null, order: 1, txt: "Direct" };
						var one = { cnt: 0, from: null, order: 2, txt: "One stop" };
						var other = { cnt: 0, from: null, order: 3, txt: "Other" };

						this.search.lastFlights.forEach((f) => {

								var stops = this.countStops(f, this.search.lastJustOneway);

								if (stops === 0) {
										this.affectStopsCat(direct, f.price);
								}

								if (stops === 1) {
										this.affectStopsCat(one, f.price);
								}

								if (stops > 1) {
										this.affectStopsCat(other, f.price);
								}
						});

						var res = [];
						if (direct.cnt > 0) {
								res.push(direct);
						}
						if (one.cnt > 0) {
								res.push(one);
						}
						if (other.cnt > 0) {
								res.push(other);
						}

						return [direct, one, other];
				}

				private genStopsFilter() {
						var $cont = $("#stopsCont");

						var lg = Common.ListGenerator.init($cont, "stops-filter-item-tmp");
						lg.evnt("input", (e, $item, $target, item) => {
								this.execFilter();
						})
								.setEvent("change");

						lg.generateList(this.lastStopCats);
				}

				private affectStopsCat(cat, price) {
						cat.cnt++;

						if (cat.from === null || cat.from > price) {
								cat.from = price;
						}
				}


		}

		export class ClassicSearch {

				public lastFlights: Flight[];
				public lastJustOneway;

				private searchFrom: Planning.DealsPlaceSearch;
				private searchTo: Planning.DealsPlaceSearch;

				private dateFrom: Common.MyCalendar;
				private dateTo: Common.MyCalendar;

				private passangers: Common.NumberPicker;

				private depFlexDays: Common.NumberPicker;
				private retFlexDays: Common.NumberPicker;

				public flightDetail = new Planning.FlightDetails();
				private filter: FlightsFilter;

				private $mainCont;
				public $results;

				private $cbUseHomeAirsFrom;
				private $cbUseHomeAirsTo;
				private $cbOneWay;

				private lastPreload: Common.CustomDialog;

				private get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				constructor() {
						this.$mainCont = $(".classic-search-cont");
						this.$results = this.$mainCont.find(".search-results");
						this.flightDetail = new Planning.FlightDetails();

						this.filter = new FlightsFilter(this);
						this.regOrderSearch();
				}

				private currentSorting = "score";

				private regOrderSearch() {
						var ac = "active";

						var $os = $("#orderSwitch");
						var $is = $os.find(".item");

						$is.click((e) => {
								var $t = $(e.target);
								$is.removeClass(ac);
								$t.addClass(ac);

								if ($os.find(".by-score").hasClass(ac)) {
										this.currentSorting = "score";
								} else {
										this.currentSorting = "price";
								}

								this.sortBy();

								this.$results.empty();
								this.flightDetail.genFlights(this.$results, this.lastFlights);
						});
				}

				private sortBy() {

						if (this.currentSorting === "score") {

								this.lastFlights = _(this.lastFlights)
										.chain()
										.sortBy("price")
										.reverse()
										.sortBy("stars")
										.reverse()
										.value();

						} else {

								this.lastFlights = _(this.lastFlights)
										.chain()
										.sortBy("score")
										.reverse()
										.sortBy("price")
										.value();
						}
				}

				private canBuildLink() {
						var fromValid = (this.searchFrom.hasSelected() || this.$cbUseHomeAirsFrom.prop("checked"));
						var toValid = (this.searchTo.hasSelected() || this.$cbUseHomeAirsTo.prop("checked"));
						return fromValid && toValid;
				}

				private regSearch() {
						$("#btnSearch").click((e) => {
								e.preventDefault();

								this.send();
						});
				}

				private send() {
						var canBuild = this.canBuildLink();
						if (!canBuild) {
								var id = new Common.InfoDialog();
								id.create(this.v.t("NotAllPlacesTitleDlg", "jsDeals"), this.v.t("NotAllPlacesBodyDlg", "jsDeals"));
								return;
						}

						var state = this.getState();

						var data = [
								["from", state.codeFrom],
								["to", state.codeTo],
								["fromType", state.codeFromType],
								["toType", state.codeToType],
								["dateFrom", state.dateFromTrans],
								["dateTo", state.dateToTrans],
								["useHomeAirsFrom", state.depHome],
								["useHomeAirsTo", state.retHome],
								["depFlexDays", state.depFlexDays],
								["retFlexDays", state.retFlexDays],
								["justOneway", state.justOneway],
								["passengers", state.passCnt]
						];

						this.majorPreloader(true);
						this.v.apiGet("KiwiSearch", data, (fs) => {

								this.lastFlights = Planning.FlightConvert2.cFlights(fs);
								this.lastFlights.forEach((f: Flight) => {
										f.stars = AnytimeAggUtils.getScoreStars(f.score);
										f.scoreOk = f.score >= 0.5;
								});
								this.sortBy();
								this.lastJustOneway = this.$cbOneWay.prop("checked");

								this.flightDetail.genFlights(this.$results, this.lastFlights);
								this.showTotalResults(this.lastFlights.length);

								this.filter.create();

								Views.ViewBase.scrollTo($("#filterCont"));

								this.majorPreloader(false);
						});
				}

				public stateChanged() {
						if (this.canBuildLink()) {
								this.updateUrlState();
						} else {
								Views.ViewBase.setUrl("/deals?type=1", `gloobster.com`);
						}
				}

				private getState() {
						var codeFrom = DealsPlaceSearch.getCode(this.searchFrom.selectedItem);
						var codeTo = DealsPlaceSearch.getCode(this.searchTo.selectedItem);

						var codeFromType = Planning.DealsPlaceSearch.getType(this.searchFrom.selectedItem).toString();
						var codeToType = Planning.DealsPlaceSearch.getType(this.searchTo.selectedItem).toString();

						var dateFromTrans = TravelB.DateUtils.momentDateToTrans(this.dateFrom.date);
						var dateToTrans = TravelB.DateUtils.momentDateToTrans(this.dateTo.date);

						var depHome = this.$cbUseHomeAirsFrom.prop("checked").toString();
						var retHome = this.$cbUseHomeAirsTo.prop("checked").toString();

						var depFlexDays = this.depFlexDays.val();
						var retFlexDays = this.retFlexDays.val();

						var justOneway = this.$cbOneWay.prop("checked").toString();

						var passCnt = this.passangers.val().toString();

						var res = {
								codeFrom: codeFrom,
								codeTo: codeTo,
								codeFromType: codeFromType,
								codeToType: codeToType,
								dateFromTrans: dateFromTrans,
								dateToTrans: dateToTrans,
								depHome: depHome,
								retHome: retHome,
								depFlexDays: depFlexDays,
								retFlexDays: retFlexDays,
								justOneway: justOneway,
								passCnt: passCnt
						};

						return res;
				}

				private updateUrlState() {
						var state = this.getState();
						var url = `/deals?type=${1}&fc=${state.codeFrom}&ft=${state.codeFromType}&tc=${state.codeTo}&tt=${state.codeToType}&dep=${state.dateFromTrans}&depFlex=${state.depFlexDays}&depHome=${state.depHome}&ret=${state.dateToTrans}&retFlex=${state.retFlexDays}&retHome=${state.retHome}&seats=${state.passCnt}&oneway=${state.justOneway}`;
						Views.ViewBase.setUrl(url, `gloobster.com`);
				}


				private showTotalResults(cnt) {
						$("#foundFlightsAll").removeClass("hidden");
						$("#flightsFound").html(cnt);
				}


				public majorPreloader(state) {
						if (state) {
								this.lastPreload = new Common.CustomDialog();
								this.lastPreload.init(Preloaders.p2(), "", "plain major-preload");
						} else {
								this.lastPreload.close();
						}
				}


				private regHomeAirs() {
						this.$cbUseHomeAirsFrom = this.regHomeAir("cbUseHomeAirsFrom", this.searchFrom);
						this.$cbUseHomeAirsTo = this.regHomeAir("cbUseHomeAirsTo", this.searchTo);
				}

				private regHomeAir(id, search) {
						var $cb = this.$mainCont.find(`#${id}`);

						$cb.click((e) => {

								Views.ViewBase.fullReqCheck(
										() => {
												var state = $cb.prop("checked");
												search.enabled(state);
												this.stateChanged();
										},
										() => {
												e.preventDefault();
										});

						});

						return $cb;
				}

				private regOneway() {
						this.$cbOneWay = $("#cbOneWay");
						this.$cbOneWay.click((e) => {
								var state = this.$cbOneWay.prop("checked");

								this.dateTo.enabled(!state);
								this.retFlexDays.enabled(!state);
								this.stateChanged();
						});
				}

				public init() {

						this.searchFrom = new DealsPlaceSearch($("#searchFrom"), this.v.t("FromPlacePlaceholder", "jsDeals"));
						this.searchFrom.onChange = () => {
								this.stateChanged();
						};

						this.searchTo = new DealsPlaceSearch($("#searchTo"), this.v.t("ToPlacePlaceholder", "jsDeals"));
						this.searchTo.onChange = () => {
								this.stateChanged();
						};

						var tomorrow = moment().add(1, "days");
						var in3Days = moment().add(3, "days");

						this.dateFrom = new Common.MyCalendar($("#dateFrom"), tomorrow);
						this.dateFrom.onChange = () => {
								if (this.dateFrom.date.isAfter(this.dateTo.date)) {
										this.dateTo.setDate(moment(this.dateFrom.date).add(1, "days"));
								}

								this.stateChanged();
						};

						this.dateTo = new Common.MyCalendar($("#dateTo"), in3Days);
						this.dateTo.onChange = () => {
								this.stateChanged();
						};

						this.passangers = new Common.NumberPicker($("#passangersCnt"), 1, 10);
						this.passangers.onChange = () => {
								this.stateChanged();
						};

						this.depFlexDays = new Common.NumberPicker($("#depFlexDays"), 0, 10);
						this.depFlexDays.onChange = () => {
								this.stateChanged();
						};

						this.retFlexDays = new Common.NumberPicker($("#arrFlexDays"), 0, 10);
						this.retFlexDays.onChange = () => {
								this.stateChanged();
						};

						this.regHomeAirs();
						this.regOneway();

						this.regSearch();
				}

				public initComps() {
						//improve?
						var isValid = notNull(this.v.getUrlParam("depHome"));
						if (!isValid) {
								return;
						}

						var depDate = TravelB.DateUtils.transToMomentDate(this.v.getUrlParam("dep"));
						this.dateFrom.setDate(depDate);

						var oneway = parseBool(this.v.getUrlParam("oneway"));
						if (oneway) {
								this.$cbOneWay.prop("checked", true);
								this.dateTo.enabled(false);
								this.retFlexDays.enabled(false);
						} else {
								var retDate = TravelB.DateUtils.transToMomentDate(this.v.getUrlParam("ret"));
								this.dateTo.setDate(retDate);
						}

						var depFlex = this.v.getUrlParam("depFlex");
						this.depFlexDays.val(depFlex);

						var retFlex = this.v.getUrlParam("retFlex");
						this.retFlexDays.val(retFlex);

						var seats = this.v.getUrlParam("seats");
						this.passangers.val(seats);

						this.initDepart(() => {
								this.initReturn(() => {
										this.send();
								});
						});
						
				}

				private initDepart(callback: Function = null) {
						var depHome = parseBool(this.v.getUrlParam("depHome"));
						if (depHome) {
								this.$cbUseHomeAirsFrom.prop("checked", true);
						} else {
								var fromCode = this.v.getUrlParam("fc");
								var fromType = this.v.getUrlParam("ft");
								this.searchFrom.setByCode(fromCode, fromType, callback);
						}
				}

				private initReturn(callback: Function = null) {
						var retHome = parseBool(this.v.getUrlParam("retHome"));
						if (retHome) {
								this.$cbUseHomeAirsTo.prop("checked", true);
						} else {
								var toCode = this.v.getUrlParam("tc");
								var toType = this.v.getUrlParam("tt");
								this.searchTo.setByCode(toCode, toType, callback);
						}
				}

		}

		export class Preloaders {

				public static idClass = "my-preload";

				public static p1($cont = null) {
						var $h = $(`<div class="preloader8 ${this.idClass}"><span></span><span></span></div>`);

						if (!$cont) {
								return $h;
						} else {
								return $cont.html($h);
						}
				}

				public static p2($cont = null) {
						var $h = $(`<div class="fountainG-all ${this.idClass}"><div id="fountainG_1" class="fountainG"></div><div id="fountainG_2" class="fountainG"></div><div id="fountainG_3" class="fountainG"></div><div id="fountainG_4" class="fountainG"></div><div id="fountainG_5" class="fountainG"></div><div id="fountainG_6" class="fountainG"></div><div id="fountainG_7" class="fountainG"></div><div id="fountainG_8" class="fountainG"></div></div>`);

						if (!$cont) {
								return $h;
						} else {
								return $cont.html($h);
						}
				}


				public static remove($cont) {
						$cont.find(this.idClass).remove();
				}
		}

}