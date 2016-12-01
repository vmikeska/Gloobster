module Planning {
	export class CityClassicSearch {
				
				private fromDate = this.addDays(new Date(), 1);
				private toDate = this.addDays(this.fromDate, 3);
				private currentFlights: Flight[] = [];

				private depTimeFrom = 0;
				private depTimeTo = 1440;
				private arrTimeFrom = 0;
				private arrTimeTo = 1440;

				private cityDetail: CityDetail;
				private airSel: AirportSelector;

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

					if (this.cityDetail.codePairs.length > 1) {
						this.airSel = new AirportSelector($tmp.find(".airpairs-filter"), this.cityDetail.codePairs);
						this.airSel.onChange = () => {
							this.filterFlightsTime();
						}
						this.airSel.init();
						$(".multi-conn-cont").show();
					}

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

						var flights = _.filter(this.currentFlights, (f: Flight) => {

								var first = _.first(f.parts);
								var last = _.last(f.parts);

								var thereMins = this.getDateMinutes(first.depTime);
								var depFits = this.timeFits(thereMins, this.depTimeFrom, this.depTimeTo);

								var backMins = this.getDateMinutes(last.depTime);
								var arrFits = this.timeFits(backMins, this.arrTimeFrom, this.arrTimeTo);

								var codeOk = true;
								if (this.cityDetail.codePairs.length > 1) {
									var actCodePairs = this.airSel.getActive();
									codeOk = _.find(actCodePairs, (p) => { return p.from === f.from && p.to === f.to });
								}

								return depFits && arrFits && codeOk;
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
								["dateFrom", fromDate],
								["dateTo", toDate],
								["scoreLevel", ScoreLevel.Standard.toString()]
						];


					this.cityDetail.codePairs.forEach((cp) => {
							var cps = ["codePairs", AirportSelector.toString(cp)];
						prms.push(cps);
					});
						
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
		
}