var Planning;
(function (Planning) {
    var ClassicSearch = (function () {
        function ClassicSearch() {
            this.$mainCont = $(".classic-search-cont");
            this.$results = this.$mainCont.find(".search-results");
            this.$filterCont = this.$mainCont.find(".filter-bar");
        }
        Object.defineProperty(ClassicSearch.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        ClassicSearch.prototype.regSearch = function () {
            var _this = this;
            $("#btnSearch").click(function (e) {
                e.preventDefault();
                var fromValid = (_this.searchFrom.hasSelected() || _this.$cbUseHomeAirsFrom.prop("checked"));
                var toValid = (_this.searchTo.hasSelected() || _this.$cbUseHomeAirsTo.prop("checked"));
                if (!fromValid || !toValid) {
                    var id = new Common.InfoDialog();
                    id.create("Places must be filled out", "Source and destination place must be filled out");
                    return;
                }
                var codeFrom = _this.getCode(_this.searchFrom.selectedItem);
                var codeTo = _this.getCode(_this.searchTo.selectedItem);
                var dateFromTrans = TravelB.DateUtils.momentDateToTrans(_this.dateFrom.date);
                var dateToTrans = TravelB.DateUtils.momentDateToTrans(_this.dateTo.date);
                var passCnt = _this.passangers.val();
                var data = [
                    ["from", codeFrom],
                    ["to", codeTo],
                    ["fromType", _this.getType(_this.searchFrom.selectedItem).toString()],
                    ["toType", _this.getType(_this.searchTo.selectedItem).toString()],
                    ["dateFrom", dateFromTrans],
                    ["dateTo", dateToTrans],
                    ["useHomeAirsFrom", _this.$cbUseHomeAirsFrom.prop("checked").toString()],
                    ["useHomeAirsTo", _this.$cbUseHomeAirsTo.prop("checked").toString()],
                    ["depFlexDays", _this.depFlexDays.val()],
                    ["arrFlexDays", _this.arrFlexDays.val()],
                    ["justOneway", _this.$cbOneWay.prop("checked").toString()],
                    ["passengers", passCnt.toString()]
                ];
                _this.v.apiGet("KiwiSearch", data, function (fs) {
                    _this.lastFlights = Planning.FlightConvert2.cFlights(fs);
                    _this.lastJustOneway = _this.$cbOneWay.prop("checked");
                    _this.lastStopCats = _this.countStopCats();
                    var fd = new Planning.FlightDetails();
                    fd.genFlights(_this.$results, _this.lastFlights);
                });
            });
        };
        ClassicSearch.prototype.countStops = function (f, justOneway) {
            var parts = f.parts.length;
            var stops = parts;
            if (!justOneway) {
                stops--;
            }
            stops--;
            return stops;
        };
        ClassicSearch.prototype.countStopCats = function () {
            var _this = this;
            var direct = { cnt: 0, from: null };
            var one = { cnt: 0, from: null };
            var two = { cnt: 0, from: null };
            var other = { cnt: 0, from: null };
            this.lastFlights.forEach(function (f) {
                var stops = _this.countStops(f, _this.lastJustOneway);
                if (stops === 0) {
                    _this.affectStopsCat(direct, f.price);
                }
                if (stops === 1) {
                    _this.affectStopsCat(one, f.price);
                }
                if (stops === 2) {
                    _this.affectStopsCat(two, f.price);
                }
                _this.affectStopsCat(other, f.price);
            });
            return { direct: direct, one: one, two: two, other: other };
        };
        ClassicSearch.prototype.affectStopsCat = function (cat, price) {
            cat.cnt++;
            if (cat.from === null || cat.from > price) {
                cat.from = price;
            }
        };
        ClassicSearch.prototype.createFilter = function () {
            var $depTime = this.timeSlider(this.$filterCont.find(".dep-time-filter"), "depTime", function (from, to) {
            });
            var $arrTime = this.timeSlider(this.$filterCont.find(".arr-time-filter"), "arrTime", function (from, to) {
            });
        };
        ClassicSearch.prototype.timeSlider = function ($cont, id, onChange) {
            var ts = new Planning.TimeSlider($cont, id);
            ts.onRangeChanged = function (from, to) {
                onChange(from, to);
            };
            ts.genSlider();
            return ts;
        };
        ClassicSearch.prototype.getType = function (item) {
            if (!item) {
                return 0;
            }
            if (item.type === 0) {
                return DealsPlaceReturnType.CountryCode;
            }
            if (item.type === 1) {
                if (any(item.childern)) {
                    return DealsPlaceReturnType.GID;
                }
                else {
                    return DealsPlaceReturnType.AirCode;
                }
            }
            if (item.type === 2) {
                return DealsPlaceReturnType.AirCode;
            }
        };
        ClassicSearch.prototype.getCode = function (item) {
            if (!item) {
                return null;
            }
            if (item.type === 0) {
                return item.cc;
            }
            if (item.type === 1) {
                if (any(item.childern)) {
                    return item.gid.toString();
                }
                else {
                    return item.air;
                }
            }
            if (item.type === 2) {
                return item.air;
            }
        };
        ClassicSearch.prototype.regHomeAirs = function () {
            this.$cbUseHomeAirsFrom = this.regHomeAir("cbUseHomeAirsFrom", this.searchFrom);
            this.$cbUseHomeAirsTo = this.regHomeAir("cbUseHomeAirsTo", this.searchTo);
        };
        ClassicSearch.prototype.regHomeAir = function (id, search) {
            var $cb = this.$mainCont.find("#" + id);
            $cb.change(function (e) {
                var state = $cb.prop("checked");
                search.enabled(state);
            });
            return $cb;
        };
        ClassicSearch.prototype.regOneway = function () {
            var _this = this;
            this.$cbOneWay = $("#cbOneWay");
            this.$cbOneWay.click(function (e) {
                var state = _this.$cbOneWay.prop("checked");
                _this.dateTo.enabled(state);
                _this.arrFlexDays.enabled(state);
            });
        };
        ClassicSearch.prototype.init = function () {
            this.createFilter();
            this.searchFrom = new Planning.DealsPlaceSearch($("#searchFrom"), "From place");
            this.searchTo = new Planning.DealsPlaceSearch($("#searchTo"), "To place");
            var tomorrow = moment().add(1, "days");
            var in3Days = moment().add(3, "days");
            this.dateFrom = new Common.MyCalendar($("#dateFrom"), tomorrow);
            this.dateTo = new Common.MyCalendar($("#dateTo"), in3Days);
            this.passangers = new Common.NumberPicker($("#passangersCnt"), 1, 10);
            this.depFlexDays = new Common.NumberPicker($("#depFlexDays"), 0, 10);
            this.arrFlexDays = new Common.NumberPicker($("#arrFlexDays"), 0, 10);
            this.regHomeAirs();
            this.regOneway();
            this.regSearch();
        };
        return ClassicSearch;
    }());
    Planning.ClassicSearch = ClassicSearch;
})(Planning || (Planning = {}));
//# sourceMappingURL=ClassicSearch.js.map