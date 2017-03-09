module Planning {
	export class GroupCombo {
		private $sect;
		private $cmb;
		private $win;

		private ocls = "opened";

		public onChange: Function;
		public onClick: Function;

		public selected = LocationGrouping.ByCity;
		private groupings;

		private $formCont;

		private section: SectionBlock;

		private get v(): Views.ViewBase {
				return Views.ViewBase.currentView;
				}

		public init(section: SectionBlock, $sect, groupings) {
			this.section = section;

				this.$sect = $sect;
				this.$formCont = $sect.find(".cat-drop-cont .cont");

			this.$cmb = this.$sect.find(".order-combo");
			this.$win = this.$sect.find(".order-sel");

			this.$cmb.click((e) => {
				var opened = this.isOpened();

				if (!opened) {
						this.initMenu();
				}

				this.section.setMenuContVisibility(!opened);

				this.setState(!opened);					
			});

			this.groupings = groupings;
		}

			public reset() {
					this.setState(false);
				this.$cmb.removeClass(this.ocls);
			}

		private initMenu() {
					var items = [];
					this.groupings.forEach((i) => {
							var item = {
									id: i,
									icon: "",
									txt: ""
							};

							if (i === LocationGrouping.ByCity) {
									item.icon = "city";
									item.txt = this.v.t("ByCity", "jsDeals");
							}

							if (i === LocationGrouping.ByCountry) {
									item.icon = "country";
									item.txt = this.v.t("ByCountry", "jsDeals");
							}

							if (i === LocationGrouping.ByContinent) {
									item.icon = "continent";
									item.txt = this.v.t("ByContinent", "jsDeals");
							}

							items.push(item);
					});

					var $c = $(`<div class="order-sel"></div>`);
			    this.$formCont.html($c);

					var lg = Common.ListGenerator.init($c, "grouping-itm-tmp");
			    lg.clearCont = true;
					lg.evnt(null, (e, $item, $target, item) => {
							this.selected = item.id;
							this.setState(false);
							this.setCmb(item.icon, item.txt);

							if (this.onChange) {
									this.onChange();
							}
					});

					lg.generateList(items);
			}

		public isOpened() {
			return this.$cmb.hasClass(this.ocls);
		}

		private setCmb(ico, txt) {
			this.$cmb.find(".sel-ico").attr("class", `icon-${ico} sel-ico`);
			this.$cmb.find(".txt").html(txt);
		}

		private setState(opened) {
			if (opened) {
				this.$win.removeClass("hidden");
				this.$cmb.addClass(this.ocls);
			} else {
				this.$win.addClass("hidden");
				this.$cmb.removeClass(this.ocls);
			}
		}


	}
}