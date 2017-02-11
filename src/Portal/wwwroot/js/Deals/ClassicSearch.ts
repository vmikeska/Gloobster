module Planning {
		
		export class ClassicSearch {

				private $mainCont;
				private $results;
				
				public get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				constructor() {
						this.$mainCont = $(".classic-search");						
						this.$results = this.$mainCont.find(".search-results");
				}
				

			public regSearch() {
					$("#btnSearch").click((e) => {
							e.preventDefault();

							//TODO: hasSelected()

							var codeFrom = this.getCode(this.searchFrom.selectedItem);							
							var codeTo = this.getCode(this.searchTo.selectedItem);
							
							var dateFromTrans = TravelB.DateUtils.momentDateToTrans(this.dateFrom.date);
							var dateToTrans = TravelB.DateUtils.momentDateToTrans(this.dateTo.date);

							var justDirect = $("#directFlights").prop("checked");

						  var passCnt = this.passangers.val();

							var data = [
									["from", codeFrom],
									["to", codeTo],
									["fromType", this.getType(this.searchFrom.selectedItem).toString()],
									["toType", this.getType(this.searchTo.selectedItem).toString()],
									["dateFrom", dateFromTrans],
									["dateTo", dateToTrans],
									["justDirect", justDirect.toString()],
									["passengers", passCnt.toString()]
							];
							
							this.v.apiGet("KiwiSearch", data, (fs) => {

									var flights = Planning.FlightConvert2.cFlights(fs);

									var fd = new Planning.FlightDetails();
									fd.genFlights(this.$results, flights);

							});

					});
				}

				private getType(item): DealsPlaceReturnType {
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

			private searchFrom: Planning.DealsPlaceSearch;
			private searchTo: Planning.DealsPlaceSearch;

				private dateFrom: Common.MyCalendar;
				private dateTo: Common.MyCalendar;

				private passangers: Common.NumberPicker;
				
				public init() {
						this.searchFrom = new DealsPlaceSearch($("#searchFrom"), "From place");
						this.searchTo = new DealsPlaceSearch($("#searchTo"), "To place");

						var tomorrow = moment().add(1, "days");
						var in3Days = moment().add(3, "days");

						this.dateFrom = new Common.MyCalendar($("#dateFrom"), tomorrow);
						this.dateTo = new Common.MyCalendar($("#dateTo"), in3Days);

						this.passangers = new Common.NumberPicker($("#passangersCnt"), 1, 10);

					  this.regSearch();
				}

		}

}