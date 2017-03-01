module Planning {
		
		export class ClassicSearch {

				private searchFrom: Planning.DealsPlaceSearch;
				private searchTo: Planning.DealsPlaceSearch;

				private dateFrom: Common.MyCalendar;
				private dateTo: Common.MyCalendar;

				private passangers: Common.NumberPicker;
				
				private depFlexDays: Common.NumberPicker;
				private arrFlexDays: Common.NumberPicker;

				private flightDetail = new Planning.FlightDetails();

				private $mainCont;
				private $results;
				private $filterCont;

				private $cbUseHomeAirsFrom;
				private $cbUseHomeAirsTo;
				private $cbOneWay;
				
				public get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				constructor() {
						this.$mainCont = $(".classic-search-cont");						
						this.$results = this.$mainCont.find(".search-results");
						this.$filterCont = this.$mainCont.find(".filter-bar");
						this.flightDetail = new Planning.FlightDetails();					
				}
				
			private regSearch() {
					$("#btnSearch").click((e) => {
							e.preventDefault();

							var fromValid = (this.searchFrom.hasSelected() || this.$cbUseHomeAirsFrom.prop("checked"));
							var toValid = (this.searchTo.hasSelected() || this.$cbUseHomeAirsTo.prop("checked"));

							if (!fromValid || !toValid) {
									var id = new Common.InfoDialog();
									id.create("Places must be filled out", "Source and destination place must be filled out");
								return;
							}
							
							var codeFrom = this.getCode(this.searchFrom.selectedItem);							
							var codeTo = this.getCode(this.searchTo.selectedItem);
							
							var dateFromTrans = TravelB.DateUtils.momentDateToTrans(this.dateFrom.date);
							var dateToTrans = TravelB.DateUtils.momentDateToTrans(this.dateTo.date);
							
						  var passCnt = this.passangers.val();

							var data = [
									["from", codeFrom],
									["to", codeTo],
									["fromType", this.getType(this.searchFrom.selectedItem).toString()],
									["toType", this.getType(this.searchTo.selectedItem).toString()],
									["dateFrom", dateFromTrans],
									["dateTo", dateToTrans],
									["useHomeAirsFrom", this.$cbUseHomeAirsFrom.prop("checked").toString()],
									["useHomeAirsTo", this.$cbUseHomeAirsTo.prop("checked").toString()],
									["depFlexDays", this.depFlexDays.val()],
									["arrFlexDays", this.arrFlexDays.val()],
									["justOneway", this.$cbOneWay.prop("checked").toString()],
									["passengers", passCnt.toString()]
							];

						  this.majorPreloader(true);
							this.v.apiGet("KiwiSearch", data, (fs) => {

									this.lastFlights = Planning.FlightConvert2.cFlights(fs);
								  this.lastJustOneway = this.$cbOneWay.prop("checked");
									this.lastStopCats = this.countStopCats();
									
									this.flightDetail.genFlights(this.$results, this.lastFlights);
									this.showTotalResults(this.lastFlights.length);

									this.createFilter();
									this.majorPreloader(false);
							});

					});
				}

			private lastFlights: Flight[];
			private lastJustOneway;
		  private lastStopCats;
				
			private countStops(f, justOneway) {
				var parts = f.parts.length;
				var stops = parts;
				if (!justOneway) {
					stops--;
				}
				stops--;

				return stops;
			}

				private countStopCats() {
						var direct = {cnt: 0, from: null, order:1, txt: "Direct"};
						var one = { cnt: 0, from: null, order: 2, txt: "One stop" };						
						var other = { cnt: 0, from: null, order: 3, txt: "Other" };

						this.lastFlights.forEach((f) => {

								var stops = this.countStops(f, this.lastJustOneway);

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
								this.filterFlightsTime();
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


				private depTimeFrom = 0;
				private depTimeTo = 1440;
				private arrTimeFrom = 0;
				private arrTimeTo = 1440;

				private airSel: AirportSelector;
				private hasMoreConns: boolean;

			private createFilter() {

				  var $f = $(".filter-bar");

					this.genStopsFilter();

					var $depTime = this.timeSlider(this.$filterCont.find(".dep-time-filter"), "depTime", (from, to) => {
							this.depTimeFrom = from;
							this.depTimeTo = to;
							this.filterFlightsTime();
					});

					var $arrTime = this.timeSlider(this.$filterCont.find(".arr-time-filter"), "arrTime", (from, to) => {
							this.arrTimeFrom = from;
							this.arrTimeTo = to;
							this.filterFlightsTime();
					});

					var $airFilterAll = $f.find(".air-filter-all");
					var pairs: CodePair[] = [];
					this.lastFlights.forEach((f) => {
							var pair = { from: f.from, to: f.to };

							var hasPair = _.find(pairs, (p) => { return p.from === pair.from && p.to === pair.to; });
							if (!hasPair) {
									pairs.push(pair);	
							}													  
					});

				  this.hasMoreConns = pairs.length > 1;

					$airFilterAll.toggleClass("hidden", !this.hasMoreConns);

					if (this.hasMoreConns) {						  
							this.airSel = new AirportSelector($airFilterAll.find(".air-filter-cont"), pairs);
							this.airSel.onChange = () => {
									this.filterFlightsTime();
							}
							this.airSel.init();
					}
					
				  $f.toggleClass("hidden", false);
				}

				private totalResultsPreload() {
					Preloaders.p1($("#flightsFound"));
				}

				private showTotalResults(cnt) {
						$("#foundFlightsAll").removeClass("hidden");
					  $("#flightsFound").html(cnt);
				}

			private filterFlightsTime() {
					this.$results.empty();
				  this.totalResultsPreload();

					var flights = _.filter(this.lastFlights, (f: Flight) => {

							var first = _.first(f.parts);
							var last = _.last(f.parts);

							var thereMins = this.getDateMinutes(first.depTime);
							var depFits = this.timeFits(thereMins, this.depTimeFrom, this.depTimeTo);

							var backMins = this.getDateMinutes(last.depTime);
							var arrFits = this.timeFits(backMins, this.arrTimeFrom, this.arrTimeTo);

							var stopsOk = false;
							var stops = this.countStops(f, this.lastJustOneway);
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
					this.flightDetail.genFlights(this.$results, flights);
			}

			private getDateMinutes(date: Date) {
					return ((date.getHours() - 1) * 60) + date.getMinutes();
			}

			private timeFits(time, from, to) {
					return from <= time && to >= time;
			}

			private timeSlider($cont, id, onChange) {
					var ts = new TimeSlider($cont, id);
					ts.onRangeChanged = (from, to) => {
							onChange(from, to);
					};
					ts.genSlider();
					return ts;
			}

			private getType(item): DealsPlaceReturnType {

				if (!item) {
					return 0;
				}

				if (item.type === 0) {
					return DealsPlaceReturnType.CountryCode;
				}

				if (item.type === 1) {
					if (any(item.childern)) {
						return DealsPlaceReturnType.GID;
					} else {
						return DealsPlaceReturnType.AirCode;
					}
				}

				if (item.type === 2) {
					return DealsPlaceReturnType.AirCode;
				}
			}

			private lastPreload: Common.CustomDialog;

			private majorPreloader(state) {
				if (state) {
					this.lastPreload = new Common.CustomDialog();
					this.lastPreload.init(Preloaders.p2(), "", "plain major-preload");
				} else {
						this.lastPreload.close();
				}
			}

			private getCode(item):string {

					if (!item) {
						return null;
					}

				if (item.type === 0) {
					return item.cc;
				}
				if (item.type === 1) {
					if (any(item.childern)) {
						return item.gid.toString();
					} else {
						return item.air;
					}
				}
				if (item.type === 2) {
					return item.air;
				}
			}

			private regHomeAirs() {
					this.$cbUseHomeAirsFrom = this.regHomeAir("cbUseHomeAirsFrom", this.searchFrom); 					
					this.$cbUseHomeAirsTo = this.regHomeAir("cbUseHomeAirsTo", this.searchTo);
			}

			private regHomeAir(id, search) {
					var $cb = this.$mainCont.find(`#${id}`);

					$cb.change((e) => {
							var state = $cb.prop("checked");
						  search.enabled(state);
					});

				return $cb;
			}

			private regOneway() {
				this.$cbOneWay = $("#cbOneWay");
				this.$cbOneWay.click((e) => {
					var state = this.$cbOneWay.prop("checked");

					this.dateTo.enabled(state);
					this.arrFlexDays.enabled(state);
				});
			}

			public init() {
					
				this.searchFrom = new DealsPlaceSearch($("#searchFrom"), "From place");
				this.searchTo = new DealsPlaceSearch($("#searchTo"), "To place");

				var tomorrow = moment().add(1, "days");
				var in3Days = moment().add(3, "days");

				this.dateFrom = new Common.MyCalendar($("#dateFrom"), tomorrow);
				this.dateTo = new Common.MyCalendar($("#dateTo"), in3Days);

				this.passangers = new Common.NumberPicker($("#passangersCnt"), 1, 10);

				this.depFlexDays = new Common.NumberPicker($("#depFlexDays"), 0, 10);
				this.arrFlexDays = new Common.NumberPicker($("#arrFlexDays"), 0, 10);

				this.regHomeAirs();
				this.regOneway();

				this.regSearch();
			}

		}

	export class Preloaders {

		public static idClass = "my-preload";

		public static p1($cont = null) {				
				var $h = $(`<div class="preloader8 flip flip8 ${this.idClass}"><span></span><span></span></div>`);

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