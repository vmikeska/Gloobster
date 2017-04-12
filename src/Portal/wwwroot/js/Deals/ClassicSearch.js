var Planning;
(function (Planning) {
    var FlightsFilter = (function () {
        function FlightsFilter(search) {
            this.depTimeFrom = 0;
            this.depTimeTo = 1440;
            this.arrTimeFrom = 0;
            this.arrTimeTo = 1440;
            this.search = search;
        }
        FlightsFilter.prototype.create = function () {
            var _this = this;
            var $c = $("#filterCont");
            var t = Views.ViewBase.currentView.registerTemplate("classic-search-filter-tmp");
            $c.html(t());
            var $f = $(".filter-bar");
            this.lastStopCats = this.countStopCats();
            this.genStopsFilter();
            var $depTime = this.timeSlider($f.find(".dep-time-filter"), "depTime", function (from, to) {
                _this.depTimeFrom = from;
                _this.depTimeTo = to;
                _this.execFilter();
            });
            var $arrTime = this.timeSlider($f.find(".arr-time-filter"), "arrTime", function (from, to) {
                _this.arrTimeFrom = from;
                _this.arrTimeTo = to;
                _this.execFilter();
            });
            var $airFilterAll = $f.find(".air-filter-all");
            var $connsFilterCol = $f.find("#connsFilterCol");
            var pairs = [];
            this.search.lastFlights.forEach(function (f) {
                var pair = { from: f.from, to: f.to };
                var hasPair = _.find(pairs, function (p) { return p.from === pair.from && p.to === pair.to; });
                if (!hasPair) {
                    pairs.push(pair);
                }
            });
            this.hasMoreConns = pairs.length > 1;
            $connsFilterCol.toggleClass("hidden", !this.hasMoreConns);
            if (this.hasMoreConns) {
                this.airSel = new Planning.AirportSelector($airFilterAll.find(".air-filter-cont"), pairs);
                this.airSel.onChange = function () {
                    _this.execFilter();
                };
                this.airSel.init();
            }
            $f.toggleClass("hidden", false);
        };
        FlightsFilter.prototype.showTotalResults = function (cnt) {
            $("#foundFlightsAll").removeClass("hidden");
            $("#flightsFound").html(cnt);
        };
        FlightsFilter.prototype.getDateMinutes = function (date) {
            return ((date.getHours() - 1) * 60) + date.getMinutes();
        };
        FlightsFilter.prototype.timeSlider = function ($cont, id, onChange) {
            var ts = new Planning.TimeSlider($cont, id);
            ts.onRangeChanged = function (from, to) {
                onChange(from, to);
            };
            ts.genSlider();
            return ts;
        };
        FlightsFilter.prototype.timeFits = function (time, from, to) {
            return from <= time && to >= time;
        };
        FlightsFilter.prototype.countStops = function (f, justOneway) {
            var parts = f.parts.length;
            var stops = parts;
            if (!justOneway) {
                stops--;
            }
            stops--;
            return stops;
        };
        FlightsFilter.prototype.execFilter = function () {
            var _this = this;
            this.search.majorPreloader(true);
            setTimeout(function () {
                _this.processFilter();
                _this.search.majorPreloader(false);
            }, 200);
        };
        FlightsFilter.prototype.processFilter = function () {
            var _this = this;
            var flights = _.filter(this.search.lastFlights, function (f) {
                var first = _.first(f.parts);
                var last = _.last(f.parts);
                var thereMins = _this.getDateMinutes(first.depTime);
                var depFits = _this.timeFits(thereMins, _this.depTimeFrom, _this.depTimeTo);
                var backMins = _this.getDateMinutes(last.depTime);
                var arrFits = _this.timeFits(backMins, _this.arrTimeFrom, _this.arrTimeTo);
                var stopsOk = false;
                var stops = _this.countStops(f, _this.search.lastJustOneway);
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
            this.search.$results.empty();
            this.search.flightDetail.genFlights(this.search.$results, flights);
        };
        FlightsFilter.prototype.countStopCats = function () {
            var _this = this;
            var direct = { cnt: 0, from: null, order: 1, txt: "Direct" };
            var one = { cnt: 0, from: null, order: 2, txt: "One stop" };
            var other = { cnt: 0, from: null, order: 3, txt: "Other" };
            this.search.lastFlights.forEach(function (f) {
                var stops = _this.countStops(f, _this.search.lastJustOneway);
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
        FlightsFilter.prototype.genStopsFilter = function () {
            var _this = this;
            var $cont = $("#stopsCont");
            var lg = Common.ListGenerator.init($cont, "stops-filter-item-tmp");
            lg.evnt("input", function (e, $item, $target, item) {
                _this.execFilter();
            })
                .setEvent("change");
            lg.generateList(this.lastStopCats);
        };
        FlightsFilter.prototype.affectStopsCat = function (cat, price) {
            cat.cnt++;
            if (cat.from === null || cat.from > price) {
                cat.from = price;
            }
        };
        return FlightsFilter;
    }());
    Planning.FlightsFilter = FlightsFilter;
    var ClassicSearch = (function () {
        function ClassicSearch() {
            this.flightDetail = new Planning.FlightDetails();
            this.currentSorting = "score";
            this.$mainCont = $(".classic-search-cont");
            this.$results = this.$mainCont.find(".search-results");
            this.flightDetail = new Planning.FlightDetails();
            this.filter = new FlightsFilter(this);
            this.regOrderSearch();
        }
        Object.defineProperty(ClassicSearch.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        ClassicSearch.prototype.regOrderSearch = function () {
            var _this = this;
            var ac = "active";
            var $os = $("#orderSwitch");
            var $is = $os.find(".item");
            $is.click(function (e) {
                var $t = $(e.target);
                $is.removeClass(ac);
                $t.addClass(ac);
                if ($os.find(".by-score").hasClass(ac)) {
                    _this.currentSorting = "score";
                }
                else {
                    _this.currentSorting = "price";
                }
                _this.sortBy();
                _this.$results.empty();
                _this.flightDetail.genFlights(_this.$results, _this.lastFlights);
            });
        };
        ClassicSearch.prototype.sortBy = function () {
            if (this.currentSorting === "score") {
                this.lastFlights = _(this.lastFlights)
                    .chain()
                    .sortBy("price")
                    .reverse()
                    .sortBy("stars")
                    .reverse()
                    .value();
            }
            else {
                this.lastFlights = _(this.lastFlights)
                    .chain()
                    .sortBy("score")
                    .reverse()
                    .sortBy("price")
                    .value();
            }
        };
        ClassicSearch.prototype.canBuildLink = function () {
            var fromValid = (this.searchFrom.hasSelected() || this.$cbUseHomeAirsFrom.prop("checked"));
            var toValid = (this.searchTo.hasSelected() || this.$cbUseHomeAirsTo.prop("checked"));
            return fromValid && toValid;
        };
        ClassicSearch.prototype.regSearch = function () {
            var _this = this;
            $("#btnSearch").click(function (e) {
                e.preventDefault();
                _this.send();
            });
        };
        ClassicSearch.prototype.send = function () {
            var _this = this;
            var canBuild = this.canBuildLink();
            if (!canBuild) {
                var id = new Common.InfoDialog();
                id.create(this.v.t("NotAllPlacesTitleDlg", "jsDeals"), this.v.t("NotAllPlacesBodyDlg", "jsDeals"));
                return;
            }
            var state = this.getState();
            var data = [
                ["from", state.codeFrom],
                ["to", state.codeTo],
                ["fromType", state.codeFromType],
                ["toType", state.codeToType],
                ["dateFrom", state.dateFromTrans],
                ["dateTo", state.dateToTrans],
                ["useHomeAirsFrom", state.depHome],
                ["useHomeAirsTo", state.retHome],
                ["depFlexDays", state.depFlexDays],
                ["retFlexDays", state.retFlexDays],
                ["justOneway", state.justOneway],
                ["passengers", state.passCnt]
            ];
            this.majorPreloader(true);
            this.v.apiGet("KiwiSearch", data, function (fs) {
                _this.lastFlights = Planning.FlightConvert2.cFlights(fs);
                _this.lastFlights.forEach(function (f) {
                    f.stars = Planning.AnytimeAggUtils.getScoreStars(f.score);
                    f.scoreOk = f.score >= 0.5;
                });
                _this.sortBy();
                _this.lastJustOneway = _this.$cbOneWay.prop("checked");
                _this.flightDetail.genFlights(_this.$results, _this.lastFlights);
                _this.showTotalResults(_this.lastFlights.length);
                _this.filter.create();
                Views.ViewBase.scrollTo($("#filterCont"));
                _this.majorPreloader(false);
            });
        };
        ClassicSearch.prototype.stateChanged = function () {
            if (this.canBuildLink()) {
                this.updateUrlState();
            }
            else {
                Views.ViewBase.setUrl("/deals?type=1", "gloobster.com");
            }
        };
        ClassicSearch.prototype.getState = function () {
            var codeFrom = Planning.DealsPlaceSearch.getCode(this.searchFrom.selectedItem);
            var codeTo = Planning.DealsPlaceSearch.getCode(this.searchTo.selectedItem);
            var codeFromType = Planning.DealsPlaceSearch.getType(this.searchFrom.selectedItem).toString();
            var codeToType = Planning.DealsPlaceSearch.getType(this.searchTo.selectedItem).toString();
            var dateFromTrans = TravelB.DateUtils.momentDateToTrans(this.dateFrom.date);
            var dateToTrans = TravelB.DateUtils.momentDateToTrans(this.dateTo.date);
            var depHome = this.$cbUseHomeAirsFrom.prop("checked").toString();
            var retHome = this.$cbUseHomeAirsTo.prop("checked").toString();
            var depFlexDays = this.depFlexDays.val();
            var retFlexDays = this.retFlexDays.val();
            var justOneway = this.$cbOneWay.prop("checked").toString();
            var passCnt = this.passangers.val().toString();
            var res = {
                codeFrom: codeFrom,
                codeTo: codeTo,
                codeFromType: codeFromType,
                codeToType: codeToType,
                dateFromTrans: dateFromTrans,
                dateToTrans: dateToTrans,
                depHome: depHome,
                retHome: retHome,
                depFlexDays: depFlexDays,
                retFlexDays: retFlexDays,
                justOneway: justOneway,
                passCnt: passCnt
            };
            return res;
        };
        ClassicSearch.prototype.updateUrlState = function () {
            var state = this.getState();
            var url = "/deals?type=" + 1 + "&fc=" + state.codeFrom + "&ft=" + state.codeFromType + "&tc=" + state.codeTo + "&tt=" + state.codeToType + "&dep=" + state.dateFromTrans + "&depFlex=" + state.depFlexDays + "&depHome=" + state.depHome + "&ret=" + state.dateToTrans + "&retFlex=" + state.retFlexDays + "&retHome=" + state.retHome + "&seats=" + state.passCnt + "&oneway=" + state.justOneway;
            Views.ViewBase.setUrl(url, "gloobster.com");
        };
        ClassicSearch.prototype.showTotalResults = function (cnt) {
            $("#foundFlightsAll").removeClass("hidden");
            $("#flightsFound").html(cnt);
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
        ClassicSearch.prototype.regHomeAirs = function () {
            this.$cbUseHomeAirsFrom = this.regHomeAir("cbUseHomeAirsFrom", this.searchFrom);
            this.$cbUseHomeAirsTo = this.regHomeAir("cbUseHomeAirsTo", this.searchTo);
        };
        ClassicSearch.prototype.regHomeAir = function (id, search) {
            var _this = this;
            var $cb = this.$mainCont.find("#" + id);
            $cb.click(function (e) {
                Views.ViewBase.fullReqCheck(function () {
                    var state = $cb.prop("checked");
                    search.enabled(state);
                    _this.stateChanged();
                }, function () {
                    e.preventDefault();
                });
            });
            return $cb;
        };
        ClassicSearch.prototype.regOneway = function () {
            var _this = this;
            this.$cbOneWay = $("#cbOneWay");
            this.$cbOneWay.click(function (e) {
                var state = _this.$cbOneWay.prop("checked");
                _this.dateTo.enabled(!state);
                _this.retFlexDays.enabled(!state);
                _this.stateChanged();
            });
        };
        ClassicSearch.prototype.init = function () {
            var _this = this;
            this.searchFrom = new Planning.DealsPlaceSearch($("#searchFrom"), this.v.t("FromPlacePlaceholder", "jsDeals"));
            this.searchFrom.onChange = function () {
                _this.stateChanged();
            };
            this.searchTo = new Planning.DealsPlaceSearch($("#searchTo"), this.v.t("ToPlacePlaceholder", "jsDeals"));
            this.searchTo.onChange = function () {
                _this.stateChanged();
            };
            var tomorrow = moment().add(1, "days");
            var in3Days = moment().add(3, "days");
            this.dateFrom = new Common.MyCalendar($("#dateFrom"), tomorrow);
            this.dateFrom.onChange = function () {
                if (_this.dateFrom.date.isAfter(_this.dateTo.date)) {
                    _this.dateTo.setDate(moment(_this.dateFrom.date).add(1, "days"));
                }
                _this.stateChanged();
            };
            this.dateTo = new Common.MyCalendar($("#dateTo"), in3Days);
            this.dateTo.onChange = function () {
                _this.stateChanged();
            };
            this.passangers = new Common.NumberPicker($("#passangersCnt"), 1, 10);
            this.passangers.onChange = function () {
                _this.stateChanged();
            };
            this.depFlexDays = new Common.NumberPicker($("#depFlexDays"), 0, 10);
            this.depFlexDays.onChange = function () {
                _this.stateChanged();
            };
            this.retFlexDays = new Common.NumberPicker($("#arrFlexDays"), 0, 10);
            this.retFlexDays.onChange = function () {
                _this.stateChanged();
            };
            this.regHomeAirs();
            this.regOneway();
            this.regSearch();
        };
        ClassicSearch.prototype.initComps = function () {
            var _this = this;
            var isValid = notNull(this.v.getUrlParam("depHome"));
            if (!isValid) {
                return;
            }
            var depDate = TravelB.DateUtils.transToMomentDate(this.v.getUrlParam("dep"));
            this.dateFrom.setDate(depDate);
            var oneway = parseBool(this.v.getUrlParam("oneway"));
            if (oneway) {
                this.$cbOneWay.prop("checked", true);
                this.dateTo.enabled(false);
                this.retFlexDays.enabled(false);
            }
            else {
                var retDate = TravelB.DateUtils.transToMomentDate(this.v.getUrlParam("ret"));
                this.dateTo.setDate(retDate);
            }
            var depFlex = this.v.getUrlParam("depFlex");
            this.depFlexDays.val(depFlex);
            var retFlex = this.v.getUrlParam("retFlex");
            this.retFlexDays.val(retFlex);
            var seats = this.v.getUrlParam("seats");
            this.passangers.val(seats);
            this.initDepart(function () {
                _this.initReturn(function () {
                    _this.send();
                });
            });
        };
        ClassicSearch.prototype.initDepart = function (callback) {
            if (callback === void 0) { callback = null; }
            var depHome = parseBool(this.v.getUrlParam("depHome"));
            if (depHome) {
                this.$cbUseHomeAirsFrom.prop("checked", true);
            }
            else {
                var fromCode = this.v.getUrlParam("fc");
                var fromType = this.v.getUrlParam("ft");
                this.searchFrom.setByCode(fromCode, fromType, callback);
            }
        };
        ClassicSearch.prototype.initReturn = function (callback) {
            if (callback === void 0) { callback = null; }
            var retHome = parseBool(this.v.getUrlParam("retHome"));
            if (retHome) {
                this.$cbUseHomeAirsTo.prop("checked", true);
            }
            else {
                var toCode = this.v.getUrlParam("tc");
                var toType = this.v.getUrlParam("tt");
                this.searchTo.setByCode(toCode, toType, callback);
            }
        };
        return ClassicSearch;
    }());
    Planning.ClassicSearch = ClassicSearch;
    var Preloaders = (function () {
        function Preloaders() {
        }
        Preloaders.p1 = function ($cont) {
            if ($cont === void 0) { $cont = null; }
            var $h = $("<div class=\"preloader8 " + this.idClass + "\"><span></span><span></span></div>");
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