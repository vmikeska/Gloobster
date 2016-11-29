module Planning {

		
	export class AnytimePageSetter implements IPageSetter {

		public connections;

		public grouping = LocationGrouping.ByCity;

		private v: Views.FlyView;

		private $cont = $("#resultsCont");
		private $filter = $("#filterCont");

		public displayer: AnytimeDisplayer;
		public filter: FilteringAnytime;

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

			this.displayer = new AnytimeDisplayer(this.$cont, this.filter);

			callback();
		}
			
		private onFilterChanged() {
			this.displayer.showResults(this.connections, this.grouping);
		}

		private initFilters() {
			this.filter = new FilteringAnytime();

			this.filter.onFilterChanged = () => {
				var state = this.filter.getStateBase();
				this.grouping = state.grouping;
				this.onFilterChanged();
			}

			this.filter.initA([
					LocationGrouping.ByCity,
					LocationGrouping.ByCountry,
					LocationGrouping.ByContinent
				],
				LocationGrouping.ByCity);
		}

		public getCustomId() {
			return null;
		}
	}
}