module Planning {


	export class Filtering {

		public onFilterChanged: Function;

		public $root = $(".filtering");
		private $locRoot = this.$root.find(".locations");
		private activeCls = "active";

		private currentStarsCnt = 5;
		private currentLevel = ScoreLevel.Excellent;

		private $levels = this.$root.find(".levels");
		private $l5 = this.$levels.find(".lev5");
		private $l3 = this.$levels.find(".lev3");
		private $l1 = this.$levels.find(".lev1");

		public init(locationItems: LocationGrouping[], activeLocation: LocationGrouping) {
				this.genLocations(locationItems, activeLocation);
			this.initLevels();
		}

		public getStateBase() {
			var $actItem = this.$locRoot.find(`.${this.activeCls}`);

			return {
					grouping: $actItem.data("type"),
					starsLevel: this.currentStarsCnt,
					currentLevel: this.currentLevel
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

				if (i === LocationGrouping.ByCity) {
					base.icon = "city";
					base.txt = "By city";
				}

				if (i === LocationGrouping.ByCountry) {
					base.icon = "country";
					base.txt = "By country";
				}

				if (i === LocationGrouping.ByContinent) {
					base.icon = "continent";
					base.txt = "By continent";
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


		private initLevels() {

			var $levels = this.$root.find(".level");

			$levels.mouseenter((e) => {

					$levels.removeClass("active");

					var $t = $(e.delegateTarget);
					if ($t.hasClass("lev5")) {
						this.levelsHover(5);
					}
					if ($t.hasClass("lev3")) {
							this.levelsHover(3);
					}
					if ($t.hasClass("lev1")) {
							this.levelsHover(1);
					}
					
			});

			$levels.mouseleave((e) => {
					$levels.removeClass("active");
					this.levelsHover(this.currentStarsCnt);
			});

			$levels.click((e) => {
					var $t = $(e.delegateTarget);
					var val = $t.data("s");

					this.currentStarsCnt = val;

					if (val === 5) {
						this.currentLevel = ScoreLevel.Excellent;
					}
					if (val === 3) {
							this.currentLevel = ScoreLevel.Good;
					}
					if (val === 1) {
							this.currentLevel = ScoreLevel.Standard;
					}
					
					this.stateChanged();
			});
		}
			
		private levelsHover(stars) {
				
				this.$l5.addClass("active");

				if (stars <= 3) {
						this.$l3.addClass("active");
				}

				if (stars <= 1) {
						this.$l1.addClass("active");
				}
		}

	}

	export class FilteringAnytime extends Filtering {

		public fromDays = 1;
		public toDays = 20;

		public initA(locationItems: LocationGrouping[], activeLocation: LocationGrouping) {
			this.init(locationItems, activeLocation);				
		}

		//public getState() {
		//	var bs = this.getStateBase();

		//	var ls = {
		//			fromDays: this.fromDays,
		//			toDays: this.toDays
		//	};

		//	var s = $.extend(bs, ls);
		//	return s;
		//}

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

	export class DaysFilter {

		public onFilterChange: Function;
		private enabled = false;

		public cbUse: Common.CustomCheckbox;

		private $cbCont;
		private $filterCont;

		constructor($cbCont, $filterCont) {
			this.$cbCont = $cbCont;
			this.$filterCont = $filterCont;
		}

		public init(useDaysFilter: boolean) {
			this.initCb(useDaysFilter);
			this.initSelect();
		}

		private initCb(useDaysFilter: boolean) {
			this.cbUse = new Common.CustomCheckbox(this.$cbCont, useDaysFilter);
			this.cbUse.onChange = () => {
				var state = this.cbUse.isChecked();
				this.setEnabled(state);
				this.change();
			}
			this.setEnabled(useDaysFilter);
		}

		private setEnabled(state: boolean) {
			this.enabled = state;

			var $c = this.$filterCont;

			if (state) {
				$c.addClass("enabled");
				$c.removeClass("disabled");
			} else {
				$c.removeClass("enabled");
				$c.addClass("disabled");
			}

		}

		private initSelect() {

			var items = [
				{ ni: 4, name: "Thu" },
				{ ni: 5, name: "Fri" },
				{ ni: 6, name: "Sat", c: "perm-sel" },
				{ ni: 7, name: "Sun" },
				{ ni: 1, name: "Mon" }
			];

			var lg = Common.ListGenerator.init(this.$filterCont.find(".ftbl"), "weekend-day-selector-template");

			lg.onItemAppended = ($item, item) => {
				if (item.ni === 5 || item.ni === 7) {
					$item.find(".day").addClass("act");
				}
			}

			lg.evnt(".day",
				(e, $item, $target, item) => {
					this.itemClicked(item.ni);
				});

			lg.evnt(".day",
					(e, $item, $target, item) => {
						this.showFocus(item.ni);
					})
				.setEvent("mouseenter");

			lg.evnt(".day",
					(e, $item, $target, item) => {
						this.unsetFocus();
					})
				.setEvent("mouseleave");

			lg.generateList(items);

		}

		private removeActNo(no) {
			var $i = this.getItemByNo(no);
			$i.removeClass("act");
		}

		private addActNo(no) {
			var $i = this.getItemByNo(no);
			$i.addClass("act");
		}

		private itemClicked(no) {
			if (!this.enabled) {
				return;
			}

			var $i = this.getItemByNo(no);
			var isAct = $i.hasClass("act");

			if (no === 4) {
				this.remAdd(isAct ? [4] : null, isAct ? null : [4, 5]);
			}

			if (no === 5) {
				this.remAdd(isAct ? [4, 5] : null, isAct ? null : [5]);
			}

			if (no === 7) {
				this.remAdd(isAct ? [7, 1] : null, isAct ? null : [7]);
			}

			if (no === 1) {
				this.remAdd(isAct ? [1] : null, isAct ? null : [7, 1]);
			}

			this.change();
		}

			private change() {
					if (this.onFilterChange) {
							this.onFilterChange();
					}
			}

		private remAdd(remms, adds) {
			if (remms) {
				remms.forEach((r) => {
					this.removeActNo(r);
				});
			}

			if (adds) {
				adds.forEach((a) => {
					this.addActNo(a);
				});
			}
		}

		public getActItems() {
			var acts = this.$filterCont.find(".act").toArray();
			var o = _.map(acts, (a) => { return parseInt($(a).data("i")); });

			var from = 6;
			if (_.contains(o, 5)) {
				from = 5;
			}
			if (_.contains(o, 4)) {
				from = 4;
			}

			var to = 6;
			if (_.contains(o, 7)) {
				to = 7;
			}
			if (_.contains(o, 1)) {
				to = 1;
			}

			return { from: from, to: to };
		}

		private showFocus(no) {
				if (!this.enabled) {
					return;
				}
				
				var nos = [];

			if (no === 4) {
				nos = [4, 5];
			}

			if (no === 5) {
				nos = [5];
			}

			if (no === 7) {
				nos = [7];
			}

			if (no === 1) {
				nos = [7, 1];
			}

			nos.forEach((noi) => {
				this.setFocus(noi);
			});
		}

		private unsetFocus() {
			this.$filterCont.find(".day").removeClass("foc");
		}

		private setFocus(no) {
			var $i = this.getItemByNo(no);
			$i.addClass("foc");
		}

		private getItemByNo(no) {
			var $i = this.$filterCont.find(`[data-i="${no}"]`);
			return $i;
		}
	}


}