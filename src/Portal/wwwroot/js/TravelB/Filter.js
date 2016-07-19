var TravelB;
(function (TravelB) {
    var Filter = (function () {
        function Filter() {
            this.selectedFilter = null;
            this.nowTemp = Views.ViewBase.currentView.registerTemplate("filterNow-template");
            this.cityTemp = Views.ViewBase.currentView.registerTemplate("filterCity-template");
        }
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
            var $ac = $("#allCheckins");
            var $jm = $("#showJustMine");
            this.wantDos = new TravelB.CategoryTagger();
            var data = TravelB.TravelBUtils.getWantDoTaggerData();
            this.wantDos.create($c, "filter", data);
            this.wantDos.onFilterChange = function () {
                var ids = _this.wantDos.getSelectedIds();
                _this.setFilter(ids);
            };
            $(".filter").find("input").click(function (e) {
                var $t = $(e.target);
                var id = $t.attr("id");
                if (id === "allCheckins") {
                    if ($ac.prop("checked") === true) {
                        $c.find("input").prop("checked", false);
                        $jm.prop("checked", false);
                        _this.setFilter(["all"]);
                    }
                    else {
                        _this.setFilter(null);
                    }
                }
                else if (id === "showJustMine") {
                    if ($jm.prop("checked") === true) {
                        $c.find("input").prop("checked", false);
                        $ac.prop("checked", false);
                        _this.setFilter(["mine"]);
                    }
                    else {
                        _this.setFilter(null);
                    }
                }
            });
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