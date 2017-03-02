module Views {

		
		export class HomePageView extends ViewBase {

			private searchFrom;
			private searchTo;
			private dateFrom;
			private dateTo;

			private $cbOneWay;

			constructor() {
				super();

				this.initSearch();

				AirLoc.registerLocationCombo($("#currentCity"), (place) => {
						window.location.href = "/deals";
				});

				this.regOneway();
				this.regClassicBtn();

			}

			private regOneway() {
					this.$cbOneWay = $("#cbOneWay");
					this.$cbOneWay.click((e) => {
							var state = this.$cbOneWay.prop("checked");

							this.dateTo.enabled(state);							
					});
			}


			private initSearch() {
						this.searchFrom = new Planning.DealsPlaceSearch($("#searchFrom"), "From place");
						this.searchTo = new Planning.DealsPlaceSearch($("#searchTo"), "To place");

						var tomorrow = moment().add(1, "days");
						var in3Days = moment().add(3, "days");

						this.dateFrom = new Common.MyCalendar($("#dateFrom"), tomorrow);
						this.dateTo = new Common.MyCalendar($("#dateTo"), in3Days);
			}

				private regClassicBtn() {
					$("#btnSearch").click((e) => {

							var fromValid = this.searchFrom.hasSelected();
							var toValid = this.searchTo.hasSelected();
							if (!fromValid || !toValid) {
									var id = new Common.InfoDialog();
									id.create("Places must be filled out", "Source and destination place must be filled out");
									return;
							}

							var codeFrom = Planning.DealsPlaceSearch.getCode(this.searchFrom.selectedItem);
							var codeTo = Planning.DealsPlaceSearch.getCode(this.searchTo.selectedItem);

							var codeFromType = Planning.DealsPlaceSearch.getType(this.searchFrom.selectedItem).toString();
							var codeToType = Planning.DealsPlaceSearch.getType(this.searchTo.selectedItem).toString();

							var dateFromTrans = TravelB.DateUtils.momentDateToTrans(this.dateFrom.date);
							var dateToTrans = TravelB.DateUtils.momentDateToTrans(this.dateTo.date);

						  var oneway = this.$cbOneWay.prop("checked");

							var sl = `/deals?type=${1}&fc=${codeFrom}&ft=${codeFromType}&tc=${codeTo}&tt=${codeToType}&dep=${dateFromTrans}&depFlex=${0}&depHome=${false}&ret=${dateToTrans}&retFlex=${0}&retHome=${false}&seats=${1}&oneway=${oneway}`;
						  window.location.href = sl;
					});
				}

			public get pageType(): PageType { return PageType.HomePage; }

	}
}