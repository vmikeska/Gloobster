module Planning {
		export class WeekendPageSetter implements IPageSetter {

		public queries;

		public grouping = LocationGrouping.ByCity;
				
		private $cont = $("#resultsCont");
		private $filter = $("#filterCont");

		public displayer: WeekendDisplayer;

		private filtering: FilteringWeekend;

		private dealsSearch: Planning.DealsSearch;
		constructor(dealsSearch: Planning.DealsSearch) {
				this.dealsSearch = dealsSearch;
		}

		public setQueries(queries) {
				this.queries = queries;
			this.onFilterChanged();
		}

		public init(callback: Function) {
			//var layoutTmp = this.dealsSearch.v.registerTemplate("filtering-template");
			//this.$filter.html(layoutTmp());

			this.initFilters();

			this.displayer = new WeekendDisplayer(this.$cont, this.filtering);

			callback();
		}
			
		private onFilterChanged() {
				this.displayer.showResults(this.queries, this.grouping);
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