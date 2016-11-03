module Planning {
	export class WeekendPageSetter {

		public connections;
			
		public grouping: Planning.LocationGrouping;
		public order: Planning.ListOrder;

		private v: Views.FlyView;

		private $cont = $("#resultsCont");
		private $filter = $("#filterCont");

		public displayer: WeekendDisplayer;

		constructor(v: Views.FlyView) {
				this.v = v;				
		}

		public setConnections(conns) {
			this.connections = conns;
			this.onFilterChanged();
		}

		public init() {
				var layoutTmp = this.v.registerTemplate("weekend-layout-template");
				this.$filter.html(layoutTmp());

				this.initWeekendFilters();

				this.displayer = new WeekendDisplayer(this.$cont);							
		}

			private onFilterChanged() {
					this.displayer.showResults(this.connections, this.grouping, this.order);
			}

		private initWeekendFilters() {

			var tabsg = new Tabs(this.$filter.find(".grouping-filter"), "groupingFilter", 40);
			tabsg.addTab("tabByCity", "By city", () => {
				this.grouping = LocationGrouping.ByCity;

			});
			tabsg.addTab("tabByCountry", "By country", () => {
				this.grouping = LocationGrouping.ByCountry;
			});
			tabsg.addTab("tabNoGrouping", "No location grouping", () => {
				this.grouping = LocationGrouping.None;
			});

			tabsg.create();

			var tabso = new Tabs($(this.$filter.find(".list-order-filter")), "listOrder", 40);
			tabso.addTab("tabByWeek", "By week", () => {
				this.order = ListOrder.ByWeek;
			});
			tabso.addTab("tabByPrice", "By price", () => {
				this.order = ListOrder.ByPrice;
			});

			tabsg.onChange = () => {
				this.onFilterChanged();
			}

			tabso.onChange = () => {
				this.onFilterChanged();
			}

			tabso.create();
		}

		//code from it might be reused

		//export class WeekendForm {
		//	private $plus1: any;
		//	private $plus2: any;

		//	constructor(data) {
		//		this.$plus1 = $("#plus1");
		//		this.$plus2 = $("#plus2");

		//		this.setDaysCheckboxes(data.extraDaysLength);

		//		this.$plus1.click((e) => {
		//			var checked = this.$plus1.prop("checked");
		//			if (checked) {
		//				this.extraDaysClicked(1);
		//			} else {
		//				this.extraDaysClicked(0);
		//			}
		//		});
		//		this.$plus2.click((e) => {
		//			var checked = this.$plus2.prop("checked");
		//			if (checked) {
		//				this.extraDaysClicked(2);
		//			} else {
		//				this.extraDaysClicked(1);
		//			}
		//		});
		//	}

		//	private setDaysCheckboxes(length) {
		//		if (length === 0) {
		//			this.$plus1.prop("checked", false);
		//			this.$plus2.prop("checked", false);
		//		}
		//		if (length === 1) {
		//			this.$plus1.prop("checked", true);
		//			this.$plus2.prop("checked", false);
		//		}
		//		if (length === 2) {
		//			this.$plus1.prop("checked", true);
		//			this.$plus2.prop("checked", true);
		//		}
		//	}

		//	private extraDaysClicked(length) {
		//		var data = PlanningSender.createRequest(PlanningType.Weekend, "ExtraDaysLength", { length: length });
		//		PlanningSender.updateProp(data, (response) => {
		//			this.setDaysCheckboxes(length);
		//		});
		//	}

		//}

	}
}