module TravelB {

	export class CustomCheckbox {
		public onChange: Function;

		private $root;
		private $checker;

		constructor($root, checked = false) {
			this.$root = $root;
			this.$checker = this.$root.find(".checker");
			this.setChecker(checked);

			this.$root.click((e) => {
				var newState = !this.isChecked();
				this.setChecker(newState);
				if (this.onChange) {
					this.onChange($root.attr("id"), newState);
				}
			});
		}

		public isChecked() {
			return this.$checker.hasClass("icon-checkmark");
		}

		public setChecker(checked) {
			this.$checker.removeClass("icon-checkmark");
			this.$checker.removeClass("icon-checkmark2");

			if (checked) {
				this.$checker.addClass("icon-checkmark");
			} else {
				this.$checker.addClass("icon-checkmark2");
			}

		}

	}


	export class Filter {

		private langsTagger;

		public onFilterSelChanged: Function;

		public selectedFilter = "gender";
		public filterDateFrom;
		public filterDateTo;
		public langs;
		public wds;

		private nowTemp;
		private cityTemp;

		private wantDos;
		

		private $filter;

		constructor() {
			this.initCheckboxes();

			this.$filter = $(".filter");

			this.nowTemp = Views.ViewBase.currentView.registerTemplate("filterNow-template");
			this.cityTemp = Views.ViewBase.currentView.registerTemplate("filterCity-template");
		}

		private useFilter: CustomCheckbox;
		private useAllCheckins: CustomCheckbox;

		private initCheckboxes() {
			this.useFilter = new CustomCheckbox($("#cbUseFilter"));
			this.useFilter.onChange = ((id, newState) => {
				this.setCheckboxes(id, newState);

				if (newState) {
					this.$filter.slideDown();
				} else {
					this.$filter.slideUp();
				}

				this.updateFilter(newState, this.useAllCheckins.isChecked());

			});
			this.useAllCheckins = new CustomCheckbox($("#cbAllCheckins"));
			this.useAllCheckins.onChange = ((id, newState) => {
				this.setCheckboxes(id, newState);

				if (newState) {
					this.$filter.slideUp();
				}

				this.updateFilter(this.useFilter.isChecked(), newState);

			});
		}

		private updateFilter(useFilter: boolean, allCheckins: boolean) {
			if (allCheckins) {
				this.setFilter(null);
				return;
			}

			if (useFilter) {
				this.setFilter("full");
			} else {
				this.setFilter("gender");
			}
		}

		private setCheckboxes(id, newState) {
			if (id === "cbUseFilter" && newState) {
				this.useAllCheckins.setChecker(false);
			}

			if (id === "cbAllCheckins" && newState) {
				this.useFilter.setChecker(false);
			}
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

			var $c = $("#filterCont");

			this.wantDos = new CategoryTagger();
			var data = TravelBUtils.getWantDoTaggerData();
			this.wantDos.create($c, "filter", data, "Filter is inactive until you choose some activities");
			this.wantDos.onFilterChange = () => {
				this.wds = this.wantDos.getSelectedIds();
				this.onFilterSelChanged();
			}
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