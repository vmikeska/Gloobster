module Planning {
	export class Filtering {

		public onFilterChanged: Function;

		public $root = $(".filtering");
		private $locRoot = this.$root.find(".locations");
		private activeCls = "active";
			
		public init(locationItems: LocationGrouping[], activeLocation: LocationGrouping) {
				this.genLocations(locationItems, activeLocation);			
		}

		public getStateBase() {
			var $actItem = this.$locRoot.find(`.${this.activeCls}`);

			return {
					grouping: $actItem.data("type")
			};
		}

		public stateChanged() {
			if (this.onFilterChanged) {
				this.onFilterChanged();
			}
		}

		private getLocsData(items) {
			var locs = _.map(items, (i) => {
				var base = {
					icon: "",
					txt: "",
					type: i
				};

				var v = Views.ViewBase.currentView;
					
				if (i === LocationGrouping.ByCity) {
					base.icon = "city";
					base.txt = v.t("ByCity", "jsDeals");
				}

				if (i === LocationGrouping.ByCountry) {
					base.icon = "country";
					base.txt = v.t("ByCountry", "jsDeals");
				}

				if (i === LocationGrouping.ByContinent) {
					base.icon = "continent";
					base.txt = v.t("ByContinent", "jsDeals");
				}

				return base;
			});

			return locs;
		}

		private genLocations(items: LocationGrouping[], active: LocationGrouping) {

			var locs = this.getLocsData(items);

			var lg = Common.ListGenerator.init(this.$locRoot, "filter-location-template");
			lg.activeItem = (item) => {
				var res = {
					cls: this.activeCls,
					isActive: false
				};

				if (item.type === active) {
					res.isActive = true;
				}

				return res;
			}

			lg.evnt(null, (e, $item, $target, item) => {
				this.$locRoot.children().removeClass(this.activeCls);
				$item.addClass(this.activeCls);
				this.stateChanged();
			});

			lg.generateList(locs);
		}


		

	}

	export class FilteringAnytime extends Filtering {

		public fromDays = 1;
		public toDays = 20;

		public initA(locationItems: LocationGrouping[], activeLocation: LocationGrouping) {
			this.init(locationItems, activeLocation);				
		}
			
		private daysRangeChanged(from, to) {
			this.fromDays = from;
			this.toDays = to;
			this.onFilterChanged();
		}
			
	}

	export class FilteringWeekend extends Filtering {

		private daysFilter: DaysFilter;

		public initW(locationItems: LocationGrouping[], activeLocation: LocationGrouping, useDaysFilter: boolean) {
			var t = Views.ViewBase.currentView.registerTemplate("filtering-weekend-template");

			var $cont = this.$root.find(".sec-line");
			$cont.html(t());
				
			this.init(locationItems, activeLocation);

			this.daysFilter = new DaysFilter($cont.find("#cbUseDaysFilter"), $cont.find(".days-filter"));

			this.daysFilter.onFilterChange = () => {
				this.stateChanged();
			};

			this.daysFilter.init(useDaysFilter);
		}

		public getState() {
			var bs = this.getStateBase();

			var days = null;
			if (this.daysFilter.cbUse.isChecked()) {
				days = this.daysFilter.getActItems();
			}
			var ls = {
					days: days
			}

			var s = $.extend(bs, ls);
			return s;
		}

	}
}