module Views {

		
		export class HomePageView extends ViewBase {

			constructor() {
				super();

					this.initSearch();

				AirLoc.registerLocationCombo($("#currentCity"), (place) => {
						window.location.href = "/deals";
				});
					
			}

			private searchFrom;
			private searchTo;
			private dateFrom;
			private dateTo;

				private initSearch() {
						this.searchFrom = new Planning.DealsPlaceSearch($("#searchFrom"), "From place");
						this.searchTo = new Planning.DealsPlaceSearch($("#searchTo"), "To place");

						var tomorrow = moment().add(1, "days");
						var in3Days = moment().add(3, "days");

						this.dateFrom = new Common.MyCalendar($("#dateFrom"), tomorrow);
						this.dateTo = new Common.MyCalendar($("#dateTo"), in3Days);
				}

			public get pageType(): PageType { return PageType.HomePage; }

	}
}