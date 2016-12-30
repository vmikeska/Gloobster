var TravelB;
(function (TravelB) {
    var Filter = (function () {
        function Filter(v) {
            this.selectedFilter = "gender";
            this.nowTemp = Views.ViewBase.currentView.registerTemplate("filterNow-template");
            this.cityTemp = Views.ViewBase.currentView.registerTemplate("filterCity-template");
            this.v = v;
            this.initCheckboxes();
            this.$filter = $(".filter");
        }
        Filter.prototype.initCheckboxes = function () {
            var _this = this;
            this.useFilter = new Common.CustomCheckbox($("#cbUseFilter"));
            this.useFilter.onChange = (function (id, newState) {
                _this.setCheckboxes(id, newState);
                if (newState) {
                    _this.$filter.slideDown();
                }
                else {
                    _this.$filter.slideUp();
                }
                _this.updateFilter(newState, _this.useAllCheckins.isChecked());
            });
            this.useAllCheckins = new Common.CustomCheckbox($("#cbAllCheckins"));
            this.useAllCheckins.onChange = (function (id, newState) {
                _this.setCheckboxes(id, newState);
                if (newState) {
                    _this.$filter.slideUp();
                }
                _this.updateFilter(_this.useFilter.isChecked(), newState);
            });
        };
        Filter.prototype.updateFilter = function (useFilter, allCheckins) {
            if (allCheckins) {
                this.setFilter("");
                return;
            }
            if (useFilter) {
                this.setFilter("full");
            }
            else {
                this.setFilter("gender");
            }
        };
        Filter.prototype.setCheckboxes = function (id, newState) {
            if (id === "cbUseFilter" && newState) {
                this.useAllCheckins.setChecker(false);
            }
            if (id === "cbAllCheckins" && newState) {
                this.useFilter.setChecker(false);
            }
        };
        Filter.prototype.initNow = function () {
            $(".filter").html(this.nowTemp());
            this.initCommon();
        };
        Filter.prototype.initCity = function () {
            $(".filter").html(this.cityTemp());
            this.initCommon();
            this.initFilterDates();
        };
        Filter.prototype.setFilter = function (filter) {
            this.selectedFilter = filter;
            this.onFilterSelChanged();
        };
        Filter.prototype.initFilterDates = function () {
            var _this = this;
            var fromDate = moment();
            var toDate = fromDate.clone().add(30, "days");
            this.filterDateFrom = fromDate;
            this.filterDateTo = toDate;
            var fd = new Common.MyCalendar($("#fromDateFilterCont"), fromDate);
            fd.onChange = function (date) {
                _this.filterDateFrom = date;
                _this.onFilterSelChanged();
            };
            var td = new Common.MyCalendar($("#toDateFilterCont"), toDate);
            td.onChange = function (date) {
                _this.filterDateTo = date;
                _this.onFilterSelChanged();
            };
        };
        Filter.prototype.initCommon = function () {
            var _this = this;
            this.initLangsTagger(this.v.defaultLangs);
            var $c = $("#filterCont");
            this.wantDos = new TravelB.CategoryTagger();
            var data = TravelB.TravelBUtils.getWantDoTaggerData();
            this.wantDos.create($c, "filter", data, this.v.t("FilterActivitesPlacehodler", "jsTravelB"));
            this.wantDos.onFilterChange = function () {
                _this.wds = _this.wantDos.getSelectedIds();
                _this.onFilterSelChanged();
            };
        };
        Filter.prototype.initLangsTagger = function (selectedItems) {
            var _this = this;
            var ls = TravelB.TravelBUtils.langsDB();
            var itemsRange = _.map(ls, function (i) {
                return { text: i.text, value: i.id, kind: "l" };
            });
            var config = new Planning.TaggingFieldConfig();
            config.containerId = "langsFilter";
            config.localValues = true;
            config.itemsRange = itemsRange;
            this.langsTagger = new Planning.TaggingField(config);
            this.langsTagger.onItemClickedCustom = function ($target, callback) {
                _this.langsChanged(callback);
            };
            this.langsTagger.onDeleteCustom = function (val, callback) {
                _this.langsChanged(callback);
            };
            var selItms = _.map(selectedItems, function (i) {
                return { value: i, kind: "l" };
            });
            this.langsTagger.setSelectedItems(selItms);
            this.refreshLangs();
        };
        Filter.prototype.langsChanged = function (callback) {
            this.refreshLangs();
            this.onFilterSelChanged();
            callback();
        };
        Filter.prototype.refreshLangs = function () {
            this.langs = _.map(this.langsTagger.selectedItems, function (i) { return i.value; });
        };
        return Filter;
    }());
    TravelB.Filter = Filter;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=Filter.js.map