module Planning {
		
		export class ClassicSearch {

				private searchFrom: Planning.DealsPlaceSearch;
				private searchTo: Planning.DealsPlaceSearch;

				private dateFrom: Common.MyCalendar;
				private dateTo: Common.MyCalendar;

				private passangers: Common.NumberPicker;
				
				private depFlexDays: Common.NumberPicker;
				private arrFlexDays: Common.NumberPicker;

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
							
							this.v.apiGet("KiwiSearch", data, (fs) => {

									this.lastFlights = Planning.FlightConvert2.cFlights(fs);
								  this.lastJustOneway = this.$cbOneWay.prop("checked");
									this.lastStopCats = this.countStopCats();

									var fd = new Planning.FlightDetails();
									fd.genFlights(this.$results, this.lastFlights);

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
						var direct = {cnt: 0, from: null};
						var one = { cnt: 0, from: null };
						var two = { cnt: 0, from: null };
						var other = { cnt: 0, from: null };

						this.lastFlights.forEach((f) => {

								var stops = this.countStops(f, this.lastJustOneway);

								if (stops === 0) {
									this.affectStopsCat(direct, f.price);
								} 

								if (stops === 1) {
										this.affectStopsCat(one, f.price);
								} 

								if (stops === 2) {
										this.affectStopsCat(two, f.price);
								} 
								
								this.affectStopsCat(other, f.price);								
						});

						return { direct: direct, one: one, two: two, other: other };
				}

				private affectStopsCat(cat, price) {
						cat.cnt++;

						if (cat.from === null || cat.from > price) {
								cat.from = price;
						}
				}


			private createFilter() {
					
					var $depTime = this.timeSlider(this.$filterCont.find(".dep-time-filter"), "depTime", (from, to) => {
							//this.depTimeFrom = from;
							//this.depTimeTo = to;
							//this.filterFlightsTime();
					});

					var $arrTime = this.timeSlider(this.$filterCont.find(".arr-time-filter"), "arrTime", (from, to) => {
							//this.arrTimeFrom = from;
							//this.arrTimeTo = to;
							//this.filterFlightsTime();
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

					//temp
				this.createFilter();

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

}