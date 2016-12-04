module Planning {
		export class WeekendPageSetter implements IPageSetter {

		public connections;

		public grouping = LocationGrouping.ByCity;

		private v: Views.FlyView;

		private $cont = $("#resultsCont");
		private $filter = $("#filterCont");

		public displayer: WeekendDisplayer;

		private filtering: FilteringWeekend;

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

			this.displayer = new WeekendDisplayer(this.$cont, this.filtering);

			callback();
		}
			
		private onFilterChanged() {
			this.displayer.showResults(this.connections, this.grouping);
		}

		private initFilters() {
				this.filtering = new FilteringWeekend();

				this.filtering.onFilterChanged = () => {
						var state = this.filtering.getStateBase();
						this.grouping = state.grouping;
				this.onFilterChanged();
			}

				this.filtering.initW([
					LocationGrouping.ByCity,
					LocationGrouping.ByCountry
				],
				LocationGrouping.ByCity,
				false);
		}

			getCustomId() {
				return null;
			}
		}
}