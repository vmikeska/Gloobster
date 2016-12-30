module TravelB {
	export class Filter {

		private langsTagger;

		public onFilterSelChanged: Function;

		public selectedFilter = "gender";
		public filterDateFrom;
		public filterDateTo;
		public langs;
		public wds;

		private nowTemp = Views.ViewBase.currentView.registerTemplate("filterNow-template");
		private cityTemp = Views.ViewBase.currentView.registerTemplate("filterCity-template");

		private wantDos;
		

		private $filter;

			private v: Views.TravelBView;

			constructor(v) {
				this.v = v;

			this.initCheckboxes();

			this.$filter = $(".filter");
		}

		private useFilter: Common.CustomCheckbox;
		private useAllCheckins: Common.CustomCheckbox;

		private initCheckboxes() {
				this.useFilter = new Common.CustomCheckbox($("#cbUseFilter"));
			this.useFilter.onChange = ((id, newState) => {
				this.setCheckboxes(id, newState);

				if (newState) {
					this.$filter.slideDown();
				} else {
					this.$filter.slideUp();
				}

				this.updateFilter(newState, this.useAllCheckins.isChecked());

			});
			this.useAllCheckins = new Common.CustomCheckbox($("#cbAllCheckins"));
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
				this.setFilter("");
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
			var fromDate = moment();
			var toDate = fromDate.clone().add(30, "days");


			this.filterDateFrom = fromDate;
			this.filterDateTo = toDate;

				var fd = new Common.MyCalendar($("#fromDateFilterCont"), fromDate);
				fd.onChange = (date) => {
						this.filterDateFrom = date;
						this.onFilterSelChanged();
				}

				var td = new Common.MyCalendar($("#toDateFilterCont"), toDate);
				td.onChange = (date) => {
						this.filterDateTo = date;
						this.onFilterSelChanged();
				}
		}

		private initCommon() {
				
			this.initLangsTagger(this.v.defaultLangs);

			var $c = $("#filterCont");

			this.wantDos = new CategoryTagger();
			var data = TravelBUtils.getWantDoTaggerData();
			this.wantDos.create($c, "filter", data, this.v.t("FilterActivitesPlacehodler", "jsTravelB"));
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