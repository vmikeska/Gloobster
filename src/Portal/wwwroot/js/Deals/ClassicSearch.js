var Planning;
(function (Planning) {
    var ClassicSearch = (function () {
        function ClassicSearch() {
            this.flightDetail = new Planning.FlightDetails();
            this.depTimeFrom = 0;
            this.depTimeTo = 1440;
            this.arrTimeFrom = 0;
            this.arrTimeTo = 1440;
            this.$mainCont = $(".classic-search-cont");
            this.$results = this.$mainCont.find(".search-results");
            this.$filterCont = this.$mainCont.find(".filter-bar");
            this.flightDetail = new Planning.FlightDetails();
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
                _this.majorPreloader(true);
                _this.v.apiGet("KiwiSearch", data, function (fs) {
                    _this.lastFlights = Planning.FlightConvert2.cFlights(fs);
                    _this.lastJustOneway = _this.$cbOneWay.prop("checked");
                    _this.lastStopCats = _this.countStopCats();
                    _this.flightDetail.genFlights(_this.$results, _this.lastFlights);
                    _this.showTotalResults(_this.lastFlights.length);
                    _this.createFilter();
                    _this.majorPreloader(false);
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
            var direct = { cnt: 0, from: null, order: 1, txt: "Direct" };
            var one = { cnt: 0, from: null, order: 2, txt: "One stop" };
            var other = { cnt: 0, from: null, order: 3, txt: "Other" };
            this.lastFlights.forEach(function (f) {
                var stops = _this.countStops(f, _this.lastJustOneway);
                if (stops === 0) {
                    _this.affectStopsCat(direct, f.price);
                }
                if (stops === 1) {
                    _this.affectStopsCat(one, f.price);
                }
                if (stops > 1) {
                    _this.affectStopsCat(other, f.price);
                }
            });
            var res = [];
            if (direct.cnt > 0) {
                res.push(direct);
            }
            if (one.cnt > 0) {
                res.push(one);
            }
            if (other.cnt > 0) {
                res.push(other);
            }
            return [direct, one, other];
        };
        ClassicSearch.prototype.genStopsFilter = function () {
            var _this = this;
            var $cont = $("#stopsCont");
            var lg = Common.ListGenerator.init($cont, "stops-filter-item-tmp");
            lg.evnt("input", function (e, $item, $target, item) {
                _this.filterFlightsTime();
            })
                .setEvent("change");
            lg.generateList(this.lastStopCats);
        };
        ClassicSearch.prototype.affectStopsCat = function (cat, price) {
            cat.cnt++;
            if (cat.from === null || cat.from > price) {
                cat.from = price;
            }
        };
        ClassicSearch.prototype.createFilter = function () {
            var _this = this;
            var $f = $(".filter-bar");
            this.genStopsFilter();
            var $depTime = this.timeSlider(this.$filterCont.find(".dep-time-filter"), "depTime", function (from, to) {
                _this.depTimeFrom = from;
                _this.depTimeTo = to;
                _this.filterFlightsTime();
            });
            var $arrTime = this.timeSlider(this.$filterCont.find(".arr-time-filter"), "arrTime", function (from, to) {
                _this.arrTimeFrom = from;
                _this.arrTimeTo = to;
                _this.filterFlightsTime();
            });
            var $airFilterAll = $f.find(".air-filter-all");
            var pairs = [];
            this.lastFlights.forEach(function (f) {
                var pair = { from: f.from, to: f.to };
                var hasPair = _.find(pairs, function (p) { return p.from === pair.from && p.to === pair.to; });
                if (!hasPair) {
                    pairs.push(pair);
                }
            });
            this.hasMoreConns = pairs.length > 1;
            $airFilterAll.toggleClass("hidden", !this.hasMoreConns);
            if (this.hasMoreConns) {
                this.airSel = new Planning.AirportSelector($airFilterAll.find(".air-filter-cont"), pairs);
                this.airSel.onChange = function () {
                    _this.filterFlightsTime();
                };
                this.airSel.init();
            }
            $f.toggleClass("hidden", false);
        };
        ClassicSearch.prototype.totalResultsPreload = function () {
            Preloaders.p1($("#flightsFound"));
        };
        ClassicSearch.prototype.showTotalResults = function (cnt) {
            $("#foundFlightsAll").removeClass("hidden");
            $("#flightsFound").html(cnt);
        };
        ClassicSearch.prototype.filterFlightsTime = function () {
            var _this = this;
            this.$results.empty();
            this.totalResultsPreload();
            var flights = _.filter(this.lastFlights, function (f) {
                var first = _.first(f.parts);
                var last = _.last(f.parts);
                var thereMins = _this.getDateMinutes(first.depTime);
                var depFits = _this.timeFits(thereMins, _this.depTimeFrom, _this.depTimeTo);
                var backMins = _this.getDateMinutes(last.depTime);
                var arrFits = _this.timeFits(backMins, _this.arrTimeFrom, _this.arrTimeTo);
                var stopsOk = false;
                var stops = _this.countStops(f, _this.lastJustOneway);
                if (stops === 0 && $("#sfcb_1").prop("checked")) {
                    stopsOk = true;
                }
                else if (stops === 1 && $("#sfcb_2").prop("checked")) {
                    stopsOk = true;
                }
                else if (stops >= 2 && $("#sfcb_3").prop("checked")) {
                    stopsOk = true;
                }
                var codeOk = true;
                if (_this.hasMoreConns) {
                    var actCodePairs = _this.airSel.getActive();
                    codeOk = _.find(actCodePairs, function (p) { return p.from === f.from && p.to === f.to; });
                }
                return depFits && arrFits && codeOk && stopsOk;
            });
            this.showTotalResults(flights.length);
            this.flightDetail.genFlights(this.$results, flights);
        };
        ClassicSearch.prototype.getDateMinutes = function (date) {
            return ((date.getHours() - 1) * 60) + date.getMinutes();
        };
        ClassicSearch.prototype.timeFits = function (time, from, to) {
            return from <= time && to >= time;
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
        ClassicSearch.prototype.majorPreloader = function (state) {
            if (state) {
                this.lastPreload = new Common.CustomDialog();
                this.lastPreload.init(Preloaders.p2(), "", "plain major-preload");
            }
            else {
                this.lastPreload.close();
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
    var Preloaders = (function () {
        function Preloaders() {
        }
        Preloaders.p1 = function ($cont) {
            if ($cont === void 0) { $cont = null; }
            var $h = $("<div class=\"preloader8 flip flip8 " + this.idClass + "\"><span></span><span></span></div>");
            if (!$cont) {
                return $h;
            }
            else {
                return $cont.html($h);
            }
        };
        Preloaders.p2 = function ($cont) {
            if ($cont === void 0) { $cont = null; }
            var $h = $("<div class=\"fountainG-all " + this.idClass + "\"><div id=\"fountainG_1\" class=\"fountainG\"></div><div id=\"fountainG_2\" class=\"fountainG\"></div><div id=\"fountainG_3\" class=\"fountainG\"></div><div id=\"fountainG_4\" class=\"fountainG\"></div><div id=\"fountainG_5\" class=\"fountainG\"></div><div id=\"fountainG_6\" class=\"fountainG\"></div><div id=\"fountainG_7\" class=\"fountainG\"></div><div id=\"fountainG_8\" class=\"fountainG\"></div></div>");
            if (!$cont) {
                return $h;
            }
            else {
                return $cont.html($h);
            }
        };
        Preloaders.remove = function ($cont) {
            $cont.find(this.idClass).remove();
        };
        Preloaders.idClass = "my-preload";
        return Preloaders;
    }());
    Planning.Preloaders = Preloaders;
})(Planning || (Planning = {}));
//# sourceMappingURL=ClassicSearch.js.map