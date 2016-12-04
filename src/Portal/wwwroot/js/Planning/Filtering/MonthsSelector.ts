module Planning {


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
	
}