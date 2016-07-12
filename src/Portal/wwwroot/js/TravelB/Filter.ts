module TravelB {
	export class Filter {

		private langsTagger;

		public onFilterSelChanged: Function;

		public selectedFilter = null;
		public filterDateFrom;
		public filterDateTo;
		public langs;
			
		private nowTemp;
		private cityTemp;

		constructor() {
			this.nowTemp = Views.ViewBase.currentView.registerTemplate("filterNow-template");
			this.cityTemp = Views.ViewBase.currentView.registerTemplate("filterCity-template");			
		}

		public initNow() {
			$(".filter").html(this.nowTemp());
			this.initCommon();
		}

		public initCity() {
			$(".filter").html(this.cityTemp());				
			this.initCommon();
			this.initFilterDates();
		}
			
		private setFilter(filter) {
			this.selectedFilter = filter;
			this.onFilterSelChanged();
		}

		private initFilterDates() {
			var fromDate = DateUtils.jsDateToMyDate(new Date());
			var toDate = DateUtils.jsDateToMyDate(DateUtils.addDays(Date.now(), 30));
			this.filterDateFrom = fromDate;
			this.filterDateTo = toDate;

			DateUtils.initDatePicker($("#fromDateFilter"), fromDate, (d) => {
				this.filterDateFrom = d;
				this.onFilterSelChanged();
			});

			DateUtils.initDatePicker($("#toDateFilter"), toDate, (d) => {
				this.filterDateTo = d;
				this.onFilterSelChanged();
			});
		}

		private initCommon() {

				var v = <Views.TravelBView>Views.ViewBase.currentView;
				
			this.initLangsTagger(v.defaultLangs);

			var items = TravelBUtils.wantDoDB();

			var $c = $("#filterCont");
			var $ac = $("#allCheckins");
			var $jm = $("#showJustMine");
				
			items.forEach((i) => {
				var $h = $(`<input id="f_${i.id}" type="checkbox" /><label for="f_${i.id}">${i.text}</label>`);
				$c.append($h);
			});

			$(".filter").find("input").click((e) => {
				var $t = $(e.target);
				var id = $t.attr("id");

				if (id === "allCheckins") {

					if ($ac.prop("checked") === true) {
						$c.find("input").prop("checked", false);
						$jm.prop("checked", false);
						this.setFilter(["all"]);
					} else {
						this.setFilter(null);
					}

				} else if (id === "showJustMine") {

					if ($jm.prop("checked") === true) {
						$c.find("input").prop("checked", false);
						$ac.prop("checked", false);
						this.setFilter(["mine"]);
					} else {
						this.setFilter(null);
					}

				} else if (id.startsWith("f_")) {

					if ($t.prop("checked") === true) {
						$ac.prop("checked", false);
					}

					var selVals = [];
					$c.find("input").each((i, c) => {
						var $c = $(c);
						if ($c.prop("checked")) {
							var id = $c.attr("id");
							var val = id.split("_")[1];
							selVals.push(val);
						}
					});
					this.setFilter(selVals);

				}

			});
		}


		private initLangsTagger(selectedItems) {

			var ls = TravelBUtils.langsDB();

			var itemsRange = _.map(ls, (i) => {
				return { text: i.text, value: i.id, kind: "l" }
			});

			var config = new Planning.TaggingFieldConfig();
			config.containerId = "langsFilter";
			config.localValues = true;
			config.itemsRange = itemsRange;

			this.langsTagger = new Planning.TaggingField(config);
			this.langsTagger.onItemClickedCustom = ($target, callback) => {
				this.langsChanged(callback);
			}

			this.langsTagger.onDeleteCustom = (val, callback) => {
				this.langsChanged(callback);
			}

			//set init values		
			var selItms = _.map(selectedItems, (i) => {
				return { value: i, kind: "l" };
			});
			this.langsTagger.setSelectedItems(selItms);
			this.refreshLangs();
		}

			private langsChanged(callback) {
				this.refreshLangs();
				this.onFilterSelChanged();
				callback();
			}

			private refreshLangs() {
				this.langs = _.map(this.langsTagger.selectedItems, (i) => { return i.value; });
			}

	}
}