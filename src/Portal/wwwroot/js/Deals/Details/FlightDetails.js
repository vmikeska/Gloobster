var Planning;
(function (Planning) {
    var FlightsOrdering = (function () {
        function FlightsOrdering() {
            var _this = this;
            this.act = "active";
            this.orderBy = "price";
            this.orderStyle = "asc";
            this.$cont = $(".deals-ordering");
            var $items = this.$cont.find(".item");
            this.setActiveById(this.orderBy);
            $items.click(function (e) {
                var $t = $(e.target);
                $items.removeClass(_this.act);
                $t.addClass(_this.act);
                _this.orderStyle = $t.data("o");
                _this.orderBy = $t.data("b");
                _this.change();
            });
        }
        FlightsOrdering.prototype.setActiveById = function (id) {
            this.$cont.find("[data-b=\"" + id + "\"]").addClass(this.act);
        };
        FlightsOrdering.prototype.setFlights = function (flights) {
            if (flights.length > 1) {
                this.$cont.removeClass("hidden");
            }
            this.flights = flights;
        };
        FlightsOrdering.prototype.change = function () {
            if (this.onChange) {
                var oFlights = [];
                if (this.orderBy === "price") {
                    oFlights = _(this.flights)
                        .chain()
                        .sortBy("price")
                        .reverse()
                        .sortBy("score")
                        .reverse()
                        .value();
                }
                if (this.orderBy === "score") {
                    oFlights = _(this.flights)
                        .chain()
                        .sortBy("score")
                        .reverse()
                        .sortBy("price")
                        .value();
                }
                this.onChange(oFlights);
            }
        };
        return FlightsOrdering;
    }());
    Planning.FlightsOrdering = FlightsOrdering;
    var FlightDetails = (function () {
        function FlightDetails() {
        }
        Object.defineProperty(FlightDetails.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        FlightDetails.prototype.genFlights = function ($cont, flights) {
            var _this = this;
            var lg = Common.ListGenerator.init($cont, "connection-flight-template");
            lg.clearCont = true;
            lg.listLimit = 20;
            lg.listLimitMoreTmp = "flights-list-more-tmp";
            lg.listLimitLessTmp = "flights-list-less-tmp";
            lg.emptyTemplate = "flights-empty-template";
            lg.customMapping = function (i) {
                var stars = Planning.AnytimeAggUtils.getScoreStars(i.score);
                return {
                    price: i.price,
                    scoreText: _this.getScoreText(stars),
                    scoreStars: stars,
                    bookLink: i.bookLink,
                    scoreOk: i.scoreOk
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
            flight.parts.forEach(function (fp) {
                if (thereFinished) {
                    backParts.push(fp);
                }
                else {
                    thereParts.push(fp);
                }
                if (fp.to === flight.to) {
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
            if (backParts.length > 0) {
                if (backParts.length === 1) {
                    majorFlights.push(backParts[0]);
                }
                else {
                    var vb = this.viewForMultiFlight(backParts);
                    majorFlights.push(vb);
                }
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
            var $cont = $multiFlight.find(".flights-sub");
            var lg = Common.ListGenerator.init($cont, "connection-single-flight-template");
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
            var airName = this.v.t("MultiAirlines", "jsDeals");
            var logoLink = "/images/n/airlogos/default-airline.svg";
            var allAirSame = _.every(parts, function (p) { return p.airline === first.airline; });
            if (allAirSame) {
                airName = Planning.AirlineCodes.getName(first.airline);
                logoLink = this.getLogoLink(first.airline);
            }
            var dur = this.getDurationMulti(first.depTime, last.arrTime);
            var res = {
                isMulti: true,
                parts: parts,
                customClass: "",
                airName: airName,
                logoLink: logoLink,
                codeFrom: first.from,
                codeTo: last.to,
                flightNo: "",
                date: this.getDate(first.depTime),
                timeFrom: this.getTime(first.depTime),
                timeTo: this.getTime(last.arrTime),
                durHours: dur.hours,
                durMins: dur.mins,
                stops: parts.length - 1
            };
            return res;
        };
        FlightDetails.prototype.mapSingleFlight = function (f) {
            var dur = this.getDuration(f.minsDuration);
            var context = {
                customClass: "",
                airName: Planning.AirlineCodes.getName(f.airline),
                logoLink: this.getLogoLink(f.airline),
                codeFrom: f.from,
                codeTo: f.to,
                flightNo: f.airline + f.flightNo,
                date: this.getDate(f.depTime),
                timeFrom: this.getTime(f.depTime),
                timeTo: this.getTime(f.arrTime),
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