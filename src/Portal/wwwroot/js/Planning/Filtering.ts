module Planning {


	export class Filtering {

		public onFilterChanged: Function;

		public $root = $(".filtering");
		private $locRoot = this.$root.find(".locations");
		private activeCls = "active";

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

		private $levels = this.$root.find(".levels");
		private $l5 = this.$levels.find(".lev5");
		private $l3 = this.$levels.find(".lev3");
		private $l1 = this.$levels.find(".lev1");

		private currentStarsCnt = 5;
		private currentLevel = ScoreLevel.Excellent;
			
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

	export class MonthsSelector {

		public onChange: Function;

		private $comp;

		public year;
		public month;

			private actCls = "active";

		constructor($cont) {
			this.$comp = $(`<div class="months-filter"></div>`);
			$cont.html(this.$comp);
		}

		public gen(cnt) {
			var items = this.getItems(cnt);

			var f = _.first(items);
			this.year = f.year;
			this.month = f.month;
				
			var lg = Common.ListGenerator.init(this.$comp, "month-item-filter-template");
			lg.evnt(null, (e, $item, $target, item) => {
					this.month = item.month;
					this.year = item.year;

					this.$comp.find(".month").removeClass(this.actCls);
					$item.addClass(this.actCls);

					this.change();					
			});

			var isFirst = true;
			lg.activeItem = (item) => {
				var r = {
					cls: "active",
					isActive: isFirst
				};

				isFirst = false;
				return r;
			}
			lg.generateList(items);
		}

			private change() {
				if (this.onChange) {
					this.onChange();
				}
			}

		private getItems(cnt) {
			var today = new Date();

			var items = [];
			for (var act = 0; act <= cnt - 1; act++) {
				var newDate = moment(today).add(act, "months");
				var txt = newDate.format("MMMM YY");

				var item = {
					txt: txt,
					month: newDate.month() + 1,
					year: newDate.year()
				}
				items.push(item);
			}
			return items;
		}
	}

	export class RangeSlider {

		public onRangeChanged: Function;

		private $from;
		private $to;

		private $cont;
		private id;

		constructor($cont, id) {
			this.$cont = $cont;
			this.id = id;
		}

		public getRange() {
			return {
				from: parseInt(this.$from.val()),
				to: parseInt(this.$to.val())
			};
		}

		private rangeChanged(from, to) {
			if (this.onRangeChanged) {
				this.onRangeChanged(from, to);
			}
		}

		public genSlider(min, max) {
			var t = Views.ViewBase.currentView.registerTemplate("range-slider-template");

			var context = {
				id: this.id
			};

			var $t = $(t(context));

			this.$cont.html($t);

			var slider = $t.find(`#${this.id}`)[0];

			this.$from = $(`#${this.id}_from`);
			this.$to = $(`#${this.id}_to`);

			this.$from.val(min);
			this.$to.val(max);

			var si = noUiSlider.create(slider,
			{
				start: [min + 1, max - 1],
				connect: true,
				step: 1,
				range: {
					"min": min,
					"max": max
				}
			});

			var fromCall = new Common.DelayedCallback(this.$from);
			fromCall.delay = 500;
			fromCall.callback = (val) => {

				var fixedVal = val;
				if (val < min) {
					fixedVal = min;
					this.$from.val(fixedVal);
				}

				si.set([fixedVal, null]);

				this.rangeChanged(fixedVal, this.$to.val());
			}

			var toCall = new Common.DelayedCallback(this.$to);
			toCall.delay = 500;
			toCall.callback = (val) => {

				var fixedVal = val;
				if (val > max) {
					fixedVal = max;
					this.$to.val(fixedVal);
				}

				si.set([null, fixedVal]);

				this.rangeChanged(this.$from.val(), fixedVal);
			}
				
			si.on("slide",
				(range) => {
					var from = parseInt(range[0]);
					var to = parseInt(range[1]);
					this.$from.val(from);
					this.$to.val(to);

					this.rangeChanged(from, to);
				});
		}
	}

	export class FilteringWeekend extends Filtering {
		private cbLong: Common.CustomCheckbox;

		public initW(locationItems: LocationGrouping[], activeLocation: LocationGrouping, longWeek: boolean) {

			var t = Views.ViewBase.currentView.registerTemplate("filtering-weekend-template");
			this.$root.find(".sec-line").html(t());

			this.cbLong = new Common.CustomCheckbox(this.$root.find("#cbLongWeekend"), longWeek);
			this.cbLong.onChange = () => {
				this.stateChanged();
			}

			this.init(locationItems, activeLocation);
		}

		public getState() {
			var bs = this.getStateBase();

			var ls = {
				longWeek: this.cbLong.isChecked()
			}

			var s = $.extend(bs, ls);
			return s;
		}

	}


}