module Planning {
	export class WeekendPageSetter {

		public connections;

		public grouping = LocationGrouping.ByCity;

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
			var layoutTmp = this.v.registerTemplate("filtering-weekend-template");
			this.$filter.html(layoutTmp());

			this.initWeekendFilters();

			this.displayer = new WeekendDisplayer(this.$cont);
		}

		private onFilterChanged() {
			this.displayer.showResults(this.connections, this.grouping);
		}

		private initWeekendFilters() {
			var f = new Filtering();

			f.onFilterChanged = () => {
				var state = f.getState();
				this.grouping = state.actItem;
				this.onFilterChanged();
			}

			f.init([
					LocationGrouping.ByCity,
					LocationGrouping.ByCountry,
					LocationGrouping.ByContinent
				],
				LocationGrouping.ByCity,
				true);
		}
	}
}