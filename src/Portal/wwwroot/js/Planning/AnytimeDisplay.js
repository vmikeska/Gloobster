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
    var AnytimeDisplay = (function () {
        function AnytimeDisplay($cont) {
            this.connections = [];
            this.aggr = new Planning.AnytimeAggregator();
            this.$cont = $cont;
            this.$filter = $("#tabsCont");
            this.genDaysSlider(1, 20);
        }
        AnytimeDisplay.prototype.render = function (connections, daysFrom, daysTo) {
            var _this = this;
            if (daysFrom === void 0) { daysFrom = null; }
            if (daysTo === void 0) { daysTo = null; }
            this.connections = connections;
            var cities = this.aggr.aggregate(connections, daysFrom, daysTo);
            cities = _.sortBy(cities, "fromPrice");
            var lg = Common.ListGenerator.init(this.$cont, "resultGroupItem-template");
            lg.clearCont = true;
            lg.customMapping = function (i) {
                return {
                    gid: i.gid,
                    title: i.name,
                    price: i.fromPrice
                };
            };
            lg.onItemAppended = function ($cityBox, item) {
                _this.generateCityGroupedOffers($cityBox, item);
            };
            lg.generateList(cities);
        };
        AnytimeDisplay.prototype.daysRangeChanged = function (daysFrom, daysTo) {
            this.render(this.connections, daysFrom, daysTo);
        };
        AnytimeDisplay.prototype.genDaysSlider = function (daysMin, daysMax) {
            var _this = this;
            var tmp = Views.ViewBase.currentView.registerTemplate("anytime-timeSlider-template");
            this.$filter.html(tmp());
            var slider = document.getElementById("daysSlider");
            var $daysFrom = $("#daysFrom");
            var $daysTo = $("#daysTo");
            $daysFrom.val(daysMin);
            $daysTo.val(daysMax);
            var si = noUiSlider.create(slider, {
                start: [daysMin + 1, daysMax - 1],
                connect: true,
                step: 1,
                range: {
                    'min': daysMin,
                    'max': daysMax
                }
            });
            var fromCall = new Common.DelayedCallback($daysFrom);
            fromCall.delay = 500;
            fromCall.callback = function (val) {
                var fixedVal = val;
                if (val < daysMin) {
                    fixedVal = daysMin;
                    $daysFrom.val(fixedVal);
                }
                si.set([fixedVal, null]);
                _this.daysRangeChanged(fixedVal, $daysTo.val());
            };
            var toCall = new Common.DelayedCallback($daysTo);
            toCall.delay = 500;
            toCall.callback = function (val) {
                var fixedVal = val;
                if (val > daysMax) {
                    fixedVal = daysMax;
                    $daysTo.val(fixedVal);
                }
                si.set([null, fixedVal]);
                _this.daysRangeChanged($daysFrom.val(), fixedVal);
            };
            si.on("slide", function (range) {
                var from = parseInt(range[0]);
                var to = parseInt(range[1]);
                $daysFrom.val(from);
                $daysTo.val(to);
                _this.daysRangeChanged(from, to);
            });
        };
        AnytimeDisplay.prototype.generateCityGroupedOffers = function ($cityBox, item) {
            var _this = this;
            var lgi = Common.ListGenerator.init($cityBox.find("table"), "resultGroup-priceItem-template");
            lgi.customMapping = function (i) {
                return {
                    from: i.fromAirport,
                    to: i.toAirport,
                    price: i.fromPrice
                };
            };
            lgi.evnt("td", function (e, $connection, $td, eItem) {
                var from = $connection.data("f");
                var to = $connection.data("t");
                var gid = $cityBox.data("gid");
                var $lastConnInRow = LastItem.getLast(_this.$cont, "flight-result", $cityBox.data("no"));
                _this.displayOffer($lastConnInRow, eItem);
            });
            lgi.generateList(item.conns);
        };
        AnytimeDisplay.prototype.displayOffer = function ($lastBox, offer) {
            var _this = this;
            $(".flight-conns").remove();
            $lastBox.after("<div class=\"flight-conns\"><div class=\"conns\"></div></div>");
            var lg = Common.ListGenerator.init($(".flight-conns .conns"), "connection-flight-template");
            lg.clearCont = true;
            lg.customMapping = function (i) {
                return {
                    price: i.Price
                };
            };
            lg.onItemAppended = function ($flightAll, flight) {
                _this.genFlight($flightAll.find(".left"), flight);
            };
            lg.generateList(offer.flights);
        };
        AnytimeDisplay.prototype.genFlight = function ($cont, flight) {
            var _this = this;
            var majorFlights = [];
            if (flight.thereParts.length === 1) {
                majorFlights.push(flight.thereParts[0]);
            }
            else {
                var vt = this.viewForMultiFlight(flight.thereParts);
                majorFlights.push(vt);
            }
            if (flight.backParts.length === 1) {
                majorFlights.push(flight.backParts[0]);
            }
            else {
                var vb = this.viewForMultiFlight(flight.backParts);
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
        AnytimeDisplay.prototype.genMultiFlightFlights = function ($multiFlight, multiFlight) {
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
        AnytimeDisplay.prototype.viewForMultiFlight = function (parts) {
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
        AnytimeDisplay.prototype.mapSingleFlight = function (f) {
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
        AnytimeDisplay.prototype.getDurationMulti = function (from, to) {
            var diffMs = to - from;
            var diffMins = diffMs / 1000 / 60;
            return this.getDuration(diffMins);
        };
        AnytimeDisplay.prototype.getDuration = function (mins) {
            var h = Math.floor(mins / 60);
            var m = mins % 60;
            return { hours: h, mins: m };
        };
        AnytimeDisplay.prototype.getDate = function (str) {
            var res = moment().utc(str).format("ddd D MMM");
            return res;
        };
        AnytimeDisplay.prototype.getTime = function (str) {
            var m = moment.utc(str);
            m.locale("de");
            var res = m.format("LT");
            return res;
        };
        AnytimeDisplay.prototype.getLogoLink = function (code) {
            return "/images/n/Examples/Lufthansa.svg";
        };
        AnytimeDisplay.prototype.getCombo = function () {
            var _this = this;
            var from = 2;
            var to = 14;
            var $combo = $("<select id=\"days\"><select>");
            var $oe = $("<option value=\"-\">Days uspecified</option>");
            $combo.append($oe);
            for (var act = from; act <= to; act++) {
                var $o = $("<option value=\"" + act + "\">" + act + " Days</option>");
                $combo.append($o);
            }
            $combo.change(function (e) {
                e.preventDefault();
                var val = $combo.val();
                _this.daysFilterChange(val);
            });
            return $combo;
        };
        AnytimeDisplay.prototype.daysFilterChange = function (val) {
            var days = (val === "-") ? null : parseInt(val);
            this.render(this.connections, days);
        };
        return AnytimeDisplay;
    }());
    Planning.AnytimeDisplay = AnytimeDisplay;
})(Planning || (Planning = {}));
//# sourceMappingURL=AnytimeDisplay.js.map