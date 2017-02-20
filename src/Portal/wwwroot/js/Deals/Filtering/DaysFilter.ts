module Planning {

		

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

		public getState() {
			var days = null;
			if (this.cbUse.isChecked()) {
				days = this.getActItems();
			}

			return days;
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

			var v = Views.ViewBase.currentView;
				
			var items = [
				{ ni: 4, name: v.t("SelDayThu", "jsDeals") },
				{ ni: 5, name: v.t("SelDayFri", "jsDeals") },
				{ ni: 6, name: v.t("SelDaySat", "jsDeals"), c: "perm-sel" },
				{ ni: 7, name: v.t("SelDaySun", "jsDeals") },
				{ ni: 1, name: v.t("SelDayMon", "jsDeals") }
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

			lg.evnt(".day", (e, $item, $target, item) => {
					
					if (this.focusTimeoutId) {
						clearTimeout(this.focusTimeoutId);
						this.focusTimeoutId = null;
					}
					
					this.showFocus(item.ni);
				})
				.setEvent("mouseenter");

			lg.evnt(".day", (e, $item, $target, item) => {
					
					this.focusTimeoutId = setTimeout(() => {
						this.focusTimeoutId = null;
						this.unsetFocus(null);
					}, 200);	
					
				})
				.setEvent("mouseleave");

			lg.generateList(items);

		}

		private focusTimeoutId = null;

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

			this.unsetFocus(null);

			nos.forEach((noi) => {
				this.setFocus(noi);
			});
		}

		private unsetFocus(no) {
			if (no) {
				var $i = this.getItemByNo(no);
				$i.removeClass("foc");
			} else {
				this.$filterCont.find(".day").removeClass("foc");
			}				
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