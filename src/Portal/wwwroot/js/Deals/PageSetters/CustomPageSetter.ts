module Planning {
		
	export class CustomPageSetter implements IPageSetter {

		private queries;
		private grouping = LocationGrouping.ByCity;

		private filter: FilteringAnytime;
		private displayer: AnytimeDisplayer;

		private customForm: CustomFrom;

		private $cont = $("#resultsCont");
		private $filter = $("#filterCont");
		

		private dealsSearch: Planning.DealsSearch;
		constructor(dealsSearch: Planning.DealsSearch) {
				this.dealsSearch = dealsSearch;
		}

		public setQueries(queries) {
				this.queries = queries;
				this.onFilterChanged();
		}
			
		public init(callback: Function) {

				var layoutTmp = this.dealsSearch.v.registerTemplate("filtering-template");
				this.$filter.html(layoutTmp());

				this.initFilters();

				this.displayer = new AnytimeDisplayer(this.$cont, this.filter);

				this.customForm = new CustomFrom(this.dealsSearch);
				this.customForm.init(() => {
					callback();
				});				
		}

		public getCustomId() {
			return this.customForm.searchId;
		}

		private onFilterChanged() {
				this.displayer.showResults(this.queries, this.grouping);
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

		
	}


}