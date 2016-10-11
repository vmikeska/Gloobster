var TravelB;
(function (TravelB) {
    var CustomCheckbox = (function () {
        function CustomCheckbox($root, checked) {
            var _this = this;
            if (checked === void 0) { checked = false; }
            this.$root = $root;
            this.$checker = this.$root.find(".checker");
            this.setChecker(checked);
            this.$root.click(function (e) {
                var newState = !_this.isChecked();
                _this.setChecker(newState);
                if (_this.onChange) {
                    _this.onChange($root.attr("id"), newState);
                }
            });
        }
        CustomCheckbox.prototype.isChecked = function () {
            return this.$checker.hasClass("icon-checkmark");
        };
        CustomCheckbox.prototype.setChecker = function (checked) {
            this.$checker.removeClass("icon-checkmark");
            this.$checker.removeClass("icon-checkmark2");
            if (checked) {
                this.$checker.addClass("icon-checkmark");
            }
            else {
                this.$checker.addClass("icon-checkmark2");
            }
        };
        return CustomCheckbox;
    }());
    TravelB.CustomCheckbox = CustomCheckbox;
    var Filter = (function () {
        function Filter() {
            this.selectedFilter = "gender";
            this.initCheckboxes();
            this.$filter = $(".filter");
            this.nowTemp = Views.ViewBase.currentView.registerTemplate("filterNow-template");
            this.cityTemp = Views.ViewBase.currentView.registerTemplate("filterCity-template");
        }
        Filter.prototype.initCheckboxes = function () {
            var _this = this;
            this.useFilter = new CustomCheckbox($("#cbUseFilter"));
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
            this.useAllCheckins = new CustomCheckbox($("#cbAllCheckins"));
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
                this.setFilter(null);
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
            var fromDate = TravelB.DateUtils.jsDateToMyDate(new Date());
            var toDate = TravelB.DateUtils.jsDateToMyDate(TravelB.DateUtils.addDays(Date.now(), 30));
            this.filterDateFrom = fromDate;
            this.filterDateTo = toDate;
            TravelB.DateUtils.initDatePicker($("#fromDateFilter"), fromDate, function (d) {
                _this.filterDateFrom = d;
                _this.onFilterSelChanged();
            });
            TravelB.DateUtils.initDatePicker($("#toDateFilter"), toDate, function (d) {
                _this.filterDateTo = d;
                _this.onFilterSelChanged();
            });
        };
        Filter.prototype.initCommon = function () {
            var _this = this;
            var v = Views.ViewBase.currentView;
            this.initLangsTagger(v.defaultLangs);
            var $c = $("#filterCont");
            this.wantDos = new TravelB.CategoryTagger();
            var data = TravelB.TravelBUtils.getWantDoTaggerData();
            this.wantDos.create($c, "filter", data, "Filter is inactive until you choose some activities");
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