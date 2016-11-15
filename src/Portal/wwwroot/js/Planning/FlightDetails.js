var Planning;
(function (Planning) {
    var LastItem = (function () {
        function LastItem() {
        }
        LastItem.getLast = function ($rootCont, itemClass, blockNo) {
            var $lastBlock;
            var can = true;
            var curBlockNo = blockNo;
            while (can) {
                var nextBlockNo = curBlockNo + 1;
                var $i = this.findByNo($rootCont, itemClass, curBlockNo);
                var $ni = this.findByNo($rootCont, itemClass, nextBlockNo);
                var hasNext = $ni != null;
                if (hasNext) {
                    var currentTop = $i.offset().top;
                    var nextTop = $ni.offset().top;
                    if (currentTop < nextTop) {
                        $lastBlock = $i;
                        can = false;
                    }
                }
                else {
                    $lastBlock = $i;
                    can = false;
                }
                curBlockNo++;
            }
            return $lastBlock;
        };
        LastItem.findByNo = function ($rootCont, itemClass, no) {
            var $found = null;
            $rootCont.find("." + itemClass).toArray().forEach(function (i) {
                var $i = $(i);
                if (parseInt($i.data("no")) === no) {
                    $found = $i;
                }
            });
            return $found;
        };
        return LastItem;
    }());
    Planning.LastItem = LastItem;
    var CityClassicSearch = (function () {
        function CityClassicSearch(cd) {
            this.fromDate = this.addDays(new Date(), 1);
            this.toDate = this.addDays(this.fromDate, 3);
            this.currentFlights = [];
            this.depTimeFrom = 0;
            this.depTimeTo = 1440;
            this.arrTimeFrom = 0;
            this.arrTimeTo = 1440;
            this.$flightsCont = $(".other-flights-cont");
            this.cityDetail = cd;
        }
        CityClassicSearch.prototype.addDays = function (date, days) {
            return moment(date).add(days, "days").toDate();
        };
        CityClassicSearch.prototype.init = function () {
            var _this = this;
            this.$flightsCont.empty();
            var $tmp = this.cityDetail.filterLayout("classics-srch-template");
            var $depDate = $tmp.find(".dep .date");
            this.datepicker($depDate, this.fromDate, function (d) {
                _this.fromDate = d;
            });
            var $depTime = this.timeSlider($tmp.find(".dep .time"), "depTime", function (from, to) {
                _this.depTimeFrom = from;
                _this.depTimeTo = to;
                _this.filterFlightsTime();
            });
            var $arrDate = $tmp.find(".arr .date");
            this.datepicker($arrDate, this.toDate, function (d) {
                _this.toDate = d;
            });
            var $arrTime = this.timeSlider($tmp.find(".arr .time"), "arrTime", function (from, to) {
                _this.arrTimeFrom = from;
                _this.arrTimeTo = to;
                _this.filterFlightsTime();
            });
            $tmp.find("#search").click(function (e) {
                e.preventDefault();
                _this.genCustomFlights();
            });
        };
        CityClassicSearch.prototype.filterFlightsTime = function () {
            var _this = this;
            this.$flightsCont.empty();
            var flights = _.filter(this.currentFlights, function (f) {
                var first = _.first(f.FlightParts);
                var last = _.last(f.FlightParts);
                var thereMins = _this.getDateMinutes(new Date(first.DeparatureTime));
                var depFits = _this.timeFits(thereMins, _this.depTimeFrom, _this.depTimeTo);
                var backMins = _this.getDateMinutes(new Date(last.DeparatureTime));
                var arrFits = _this.timeFits(backMins, _this.arrTimeFrom, _this.arrTimeTo);
                return depFits && arrFits;
            });
            this.cityDetail.flightDetails.genFlights(this.$flightsCont, flights);
        };
        CityClassicSearch.prototype.timeFits = function (time, from, to) {
            return from <= time && to >= time;
        };
        CityClassicSearch.prototype.getDateMinutes = function (date) {
            return ((date.getHours() - 1) * 60) + date.getMinutes();
        };
        CityClassicSearch.prototype.genCustomFlights = function () {
            var _this = this;
            var fromDate = TravelB.DateUtils.myDateToTrans(TravelB.DateUtils.jsDateToMyDate(this.fromDate));
            var toDate = TravelB.DateUtils.myDateToTrans(TravelB.DateUtils.jsDateToMyDate(this.toDate));
            var prms = [
                ["ss", "1"],
                ["codeFrom", this.cityDetail.codeFrom],
                ["codeTo", this.cityDetail.codeTo],
                ["dateFrom", fromDate],
                ["dateTo", toDate],
                ["scoreLevel", ScoreLevel.Standard.toString()]
            ];
            this.cityDetail.genFlights(prms, function (flights) {
                _this.currentFlights = flights;
            });
        };
        CityClassicSearch.prototype.timeSlider = function ($cont, id, onChange) {
            var ts = new Planning.TimeSlider($cont, id);
            ts.onRangeChanged = function (from, to) {
                onChange(from, to);
            };
            ts.genSlider();
            return ts;
        };
        CityClassicSearch.prototype.datepicker = function ($dp, date, callback) {
            $dp.datepicker();
            $dp.datepicker("setDate", date);
            $dp.change(function (e) {
                var $this = $(e.target);
                var date = $this.datepicker("getDate");
                callback(date);
            });
        };
        return CityClassicSearch;
    }());
    Planning.CityClassicSearch = CityClassicSearch;
    var CityDetail = (function () {
        function CityDetail(scoreLevel, codeFrom, codeTo, cityName, gid) {
            this.v = Views.ViewBase.currentView;
            this.flightDetails = new FlightDetails();
            this.scoreLevel = scoreLevel;
            this.codeFrom = codeFrom;
            this.codeTo = codeTo;
            this.cityName = cityName;
            this.gid = gid;
        }
        CityDetail.prototype.init = function (flights) {
            flights = _.sortBy(flights, "Price");
            this.flightDetails.genFlights(this.$layout.find(".flights"), flights);
            this.genMonthFlights();
        };
        CityDetail.prototype.destroyLayout = function () {
            $(".city-deal").remove();
        };
        CityDetail.prototype.initTabs = function ($cont, callback) {
            var $tabs = $cont.find(".tab");
            $cont.find(".tab")
                .click(function (e) {
                e.preventDefault();
                var $t = $(e.delegateTarget);
                $tabs.removeClass("active");
                $t.addClass("active");
                var t = $t.data("t");
                callback(t);
            });
        };
        CityDetail.prototype.createLayout = function ($lastBox) {
            var _this = this;
            this.destroyLayout();
            var cityDealLayout = this.v.registerTemplate("city-deals-template");
            var context = {
                gid: this.gid,
                cityName: this.cityName,
                codeFrom: this.codeFrom,
                codeTo: this.codeTo
            };
            this.$layout = $(cityDealLayout(context));
            $lastBox.after(this.$layout);
            this.initDeals();
            this.initTabs(this.$layout.find(".search-tabs"), function (t) {
                _this.$layout.find(".tabs-cont").empty();
                _this.$layout.find(".other-flights-cont").empty();
                if (t === "deals") {
                    _this.initDeals();
                }
                if (t === "classic") {
                    _this.classicSearch = new CityClassicSearch(_this);
                    _this.classicSearch.init();
                }
            });
            this.$layout.find(".close").click(function (e) {
                e.preventDefault();
                _this.destroyLayout();
            });
        };
        CityDetail.prototype.filterLayout = function (tmpName) {
            var t = this.v.registerTemplate(tmpName);
            var $tmp = $(t());
            this.$layout.find(".tabs-cont").html($tmp);
            return $tmp;
        };
        CityDetail.prototype.initDeals = function () {
            var _this = this;
            var $tmp = this.filterLayout("deals-srch-template");
            this.slider = new Planning.RangeSlider($tmp.find(".days-range"), "daysRange");
            this.slider.genSlider(1, 21);
            this.slider.onRangeChanged = function () {
                _this.genMonthFlights();
            };
            this.monthsSel = new Planning.MonthsSelector($tmp.find(".months"));
            this.monthsSel.gen(12);
            this.monthsSel.onChange = function () {
                _this.genMonthFlights();
            };
        };
        CityDetail.prototype.preloader = function (show) {
            var $p = this.$layout.find(".other-flights-preloader");
            if (show) {
                $p.show();
            }
            else {
                $p.hide();
            }
        };
        CityDetail.prototype.genMonthFlights = function () {
            var days = this.slider.getRange();
            var prms = [
                ["ss", "0"],
                ["codeFrom", this.codeFrom],
                ["codeTo", this.codeTo],
                ["daysFrom", days.from.toString()],
                ["daysTo", days.to.toString()],
                ["monthNo", this.monthsSel.month.toString()],
                ["yearNo", this.monthsSel.year.toString()],
                ["scoreLevel", this.scoreLevel.toString()]
            ];
            this.genFlights(prms);
        };
        CityDetail.prototype.genFlights = function (prms, callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            var $ofCont = this.$layout.find(".other-flights-cont");
            $ofCont.empty();
            this.preloader(true);
            this.v.apiGet("SkypickerCity", prms, function (fs) {
                if (callback) {
                    callback(fs);
                }
                fs = _(fs)
                    .chain()
                    .sortBy("Price")
                    .reverse()
                    .sortBy("FlightScore")
                    .reverse()
                    .value();
                _this.flightDetails.genFlights($ofCont, fs);
                _this.preloader(false);
            });
        };
        return CityDetail;
    }());
    Planning.CityDetail = CityDetail;
    var FlightDetails = (function () {
        function FlightDetails() {
        }
        FlightDetails.prototype.genFlights = function ($cont, flights) {
            var _this = this;
            var lg = Common.ListGenerator.init($cont, "connection-flight-template");
            lg.clearCont = true;
            lg.isAsync = true;
            lg.emptyTemplate = "flights-empty-template";
            lg.customMapping = function (i) {
                var stars = Planning.AnytimeAggUtils.getScoreStars(i.FlightScore);
                return {
                    price: i.Price,
                    scoreText: _this.getScoreText(stars),
                    scoreStars: stars
                };
            };
            lg.onItemAppended = function ($flightAll, flight) {
                _this.genFlight($flightAll.find(".left"), flight);
            };
            lg.generateList(flights);
        };
        FlightDetails.prototype.getScoreText = function (stars) {
            if (stars === 5 || stars === 4) {
                return "E";
            }
            if (stars === 3 || stars === 2) {
                return "G";
            }
            return "S";
        };
        FlightDetails.prototype.splitInboundOutboundFlight = function (flight) {
            var thereParts = [];
            var backParts = [];
            var thereFinished = false;
            flight.FlightParts.forEach(function (fp) {
                if (thereFinished) {
                    backParts.push(fp);
                }
                else {
                    thereParts.push(fp);
                }
                if (fp.To === flight.To) {
                    thereFinished = true;
                }
            });
            return {
                thereParts: thereParts,
                backParts: backParts
            };
        };
        FlightDetails.prototype.genFlight = function ($cont, flight) {
            var _this = this;
            var inOut = this.splitInboundOutboundFlight(flight);
            var thereParts = inOut.thereParts;
            var backParts = inOut.backParts;
            var majorFlights = [];
            if (thereParts.length === 1) {
                majorFlights.push(thereParts[0]);
            }
            else {
                var vt = this.viewForMultiFlight(thereParts);
                majorFlights.push(vt);
            }
            if (backParts.length === 1) {
                majorFlights.push(backParts[0]);
            }
            else {
                var vb = this.viewForMultiFlight(backParts);
                majorFlights.push(vb);
            }
            var lgi = Common.ListGenerator.init($cont, "connection-single-flight-template");
            lgi.customMapping = function (f) {
                if (f.isMulti) {
                    return f;
                }
                else {
                    return _this.mapSingleFlight(f);
                }
            };
            lgi.evnt(".stops-btn", function (e, $multiFlight, $btn, multiFlight) {
                var $arrow = $btn.find(".icon-dropdown-arrow");
                if (multiFlight.subList) {
                    multiFlight.subList.destroy();
                    multiFlight.subList = null;
                    $arrow.removeClass("opened");
                }
                else {
                    var subFlightsLg = _this.genMultiFlightFlights($multiFlight, multiFlight);
                    multiFlight.subList = subFlightsLg;
                    $arrow.addClass("opened");
                }
            });
            lgi.generateList(majorFlights);
        };
        FlightDetails.prototype.genMultiFlightFlights = function ($multiFlight, multiFlight) {
            var _this = this;
            var lg = Common.ListGenerator.init($multiFlight, "connection-single-flight-template");
            lg.appendStyle = "after";
            lg.customMapping = function (f) {
                var res = _this.mapSingleFlight(f);
                res.customClass = "sub-part";
                return res;
            };
            lg.generateList(multiFlight.parts);
            return lg;
        };
        FlightDetails.prototype.viewForMultiFlight = function (parts) {
            var first = _.first(parts);
            var last = _.last(parts);
            var airName = "Multi airlines";
            var logoLink = "/images/n/Examples/SwissAir.svg";
            var allAirSame = _.every(parts, function (p) { return p.Airline === first.Airline; });
            if (allAirSame) {
                airName = Planning.AirlineCodes.getName(first.Airline);
                logoLink = this.getLogoLink(first.Airline);
            }
            var dur = this.getDurationMulti(new Date(first.DeparatureTime), new Date(last.ArrivalTime));
            var res = {
                isMulti: true,
                parts: parts,
                customClass: "",
                airName: airName,
                logoLink: logoLink,
                codeFrom: first.From,
                codeTo: last.To,
                flightNo: "",
                date: this.getDate(first.DeparatureTime),
                timeFrom: this.getTime(first.DeparatureTime),
                timeTo: this.getTime(last.ArrivalTime),
                durHours: dur.hours,
                durMins: dur.mins,
                stops: parts.length - 1
            };
            return res;
        };
        FlightDetails.prototype.mapSingleFlight = function (f) {
            var dur = this.getDuration(f.MinsDuration);
            var context = {
                customClass: "",
                airName: Planning.AirlineCodes.getName(f.Airline),
                logoLink: this.getLogoLink(f.Airline),
                codeFrom: f.From,
                codeTo: f.To,
                flightNo: f.Airline + f.FlightNo,
                date: this.getDate(f.DeparatureTime),
                timeFrom: this.getTime(f.DeparatureTime),
                timeTo: this.getTime(f.ArrivalTime),
                durHours: dur.hours,
                durMins: dur.mins,
                stops: 0
            };
            return context;
        };
        FlightDetails.prototype.getDurationMulti = function (from, to) {
            var diffMs = to - from;
            var diffMins = diffMs / 1000 / 60;
            return this.getDuration(diffMins);
        };
        FlightDetails.prototype.getDuration = function (mins) {
            var h = Math.floor(mins / 60);
            var m = mins % 60;
            return { hours: h, mins: m };
        };
        FlightDetails.prototype.getDate = function (str) {
            var res = moment.utc(str).format("ddd D MMM");
            return res;
        };
        FlightDetails.prototype.getTime = function (str) {
            var m = moment.utc(str);
            m.locale("de");
            var res = m.format("LT");
            return res;
        };
        FlightDetails.prototype.getLogoLink = function (code) {
            var airs = ["OK", "LX", "4U", "5J", "9U", "9W", "A3", "A5", "A9", "AA", "AB", "AC", "AF", "AK", "AS", "AV", "AY", "AZ", "B2", "B6", "BA", "BE", "BT", "BY", "CA", "CI", "CX", "CZ", "D8", "DE", "DJ", "DL", "DP", "DY", "EI", "EK", "EV", "EW", "F9", "FI", "FL", "FR", "FV", "G3", "GA", "HG", "HQ", "HU", "HV", "IB", "IG", "JJ", "JL", "JP", "JQ", "JT", "JU", "KC", "KE", "KL", "KM", "LA", "LG", "LH", "LO", "LP", "LS", "LU", "MH", "MQ", "MT", "MU", "NH", "NZ", "OA", "OO", "OS", "OU", "OZ", "PC", "PS", "QF", "QR", "QU", "RO", "S7", "SK", "SN", "SQ", "SR", "ST", "SU", "SV", "SW", "TG", "TK", "TO", "TP", "TV", "U2", "U6", "UA", "UT", "UX", "VA", "VN", "VS", "VX", "VY", "W6", "WN", "WS", "X3", "XQ", "YM", "ZH"];
            if (!_.contains(airs, code)) {
                code = "default-airline";
            }
            return "/images/n/airlogos/" + code + ".svg";
        };
        return FlightDetails;
    }());
    Planning.FlightDetails = FlightDetails;
})(Planning || (Planning = {}));
//# sourceMappingURL=FlightDetails.js.map