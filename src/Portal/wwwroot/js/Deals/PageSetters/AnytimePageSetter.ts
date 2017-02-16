module Planning {

		
	export class AnytimePageSetter implements IPageSetter {

		public queries;
			
		public displayer: AnytimeDisplayer;
		public filter: FilteringAnytime;
			
		public setQueries(queries) {
				this.queries = queries;
			this.onFilterChanged();
		}

		public init(callback: Function) {
			//var layoutTmp = this.dealsSearch.v.registerTemplate("filtering-template");
			//this.$filter.html(layoutTmp());

			this.initFilters();

			//this.displayer = new AnytimeDisplayer(this.$cont, this.filter);

			callback();
		}
			
		private onFilterChanged() {
			//this.displayer.showResults(this.queries, this.grouping);
		}

		private initFilters() {
			this.filter = new FilteringAnytime();

			this.filter.onFilterChanged = () => {
				//var state = this.filter.getStateBase();
				//this.grouping = state.grouping;
				//this.onFilterChanged();
			}
		}

	}
}