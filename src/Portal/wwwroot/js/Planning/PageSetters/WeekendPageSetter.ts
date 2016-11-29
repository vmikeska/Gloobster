module Planning {
		export class WeekendPageSetter implements IPageSetter {

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

		public init(callback: Function) {
			var layoutTmp = this.v.registerTemplate("filtering-template");
			this.$filter.html(layoutTmp());

			this.initFilters();

			this.displayer = new WeekendDisplayer(this.$cont);

			callback();
		}
			
		private onFilterChanged() {
			this.displayer.showResults(this.connections, this.grouping);
		}

		private initFilters() {
				var f = new FilteringWeekend();

			f.onFilterChanged = () => {
				var state = f.getState();
				this.grouping = state.actItem;
				this.onFilterChanged();
			}

			f.initW([
					LocationGrouping.ByCity,
					LocationGrouping.ByCountry
				],
				LocationGrouping.ByCity,
				true);
		}

			getCustomId() {
				return null;
			}
		}
}