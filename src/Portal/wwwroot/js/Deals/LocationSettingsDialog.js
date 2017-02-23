var Planning;
(function (Planning) {
    var DealsInitSettings = (function () {
        function DealsInitSettings(locDlg) {
            this.airTemplate = Views.ViewBase.currentView.registerTemplate("homeAirportItem-template");
            this.kmRangeSelected = 200;
            this.$stepOne = $(".step-one");
            this.$stepTwo = $(".step-two");
            this.$stepThree = $(".step-three");
            this.locDlg = locDlg;
        }
        Object.defineProperty(DealsInitSettings.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        DealsInitSettings.prototype.init = function (hasCity, hasCountry) {
            var _this = this;
            this.setForm(hasCity, hasCountry, false);
            Views.AirLoc.registerLocationCombo($("#wizCurrentCity"), function (place) {
                _this.locDlg.updateLoc(place.City, place.CountryCode);
                _this.setForm(true, false, false);
                _this.getAirs(function (as) {
                    _this.genAirs(as);
                });
            });
            this.regNextBtns();
            this.initAirports();
        };
        DealsInitSettings.prototype.setForm = function (hasCity, hasAirs, anyItems) {
            $(".labels .label").removeClass("active");
            $(".step").addClass("hidden");
            var num;
            if (!hasCity) {
                num = "one";
            }
            else if (!hasAirs) {
                num = "two";
            }
            else if (!anyItems) {
                num = "three";
            }
            $(".step-" + num).removeClass("hidden");
            $(".label-" + num).addClass("active");
        };
        DealsInitSettings.prototype.regNextBtns = function () {
            var _this = this;
            $("#stepTwoNext").click(function (e) {
                e.preventDefault();
                _this.setForm(true, true, false);
                _this.onThirdStep();
            });
            $("#stepThreeClose").click(function (e) {
                e.preventDefault();
                $(".deals-block-all").remove();
            });
        };
        DealsInitSettings.prototype.getAirs = function (callback) {
            this.v.apiGet("airportRange", null, function (as) {
                callback(as);
            });
        };
        DealsInitSettings.prototype.genAirs = function (as) {
            var _this = this;
            this.locDlg.generateAirports(as);
            var lg = Common.ListGenerator.init($("#wizAirCont"), "wiz-air-item");
            lg.clearCont = true;
            lg.evnt(".delete", function (e, $item, $target, item) {
                var data = [["id", item.origId]];
                Views.ViewBase.currentView.apiDelete("AirportRange", data, function () {
                    _this.getAirs(function (ass) {
                        _this.genAirs(ass);
                    });
                });
            });
            lg.generateList(as);
        };
        DealsInitSettings.prototype.initAirports = function () {
            var _this = this;
            var ac = new Trip.AirportCombo("wizAirCombo", { clearAfterSelection: true });
            ac.onSelected = function (e) {
                var data = { airportId: e.id };
                _this.v.apiPost("airportRange", data, function (a) {
                    _this.getAirs(function (ass) {
                        _this.genAirs(ass);
                    });
                });
            };
        };
        return DealsInitSettings;
    }());
    Planning.DealsInitSettings = DealsInitSettings;
    var LocationSettingsDialog = (function () {
        function LocationSettingsDialog() {
            var _this = this;
            this.airTemplate = Views.ViewBase.currentView.registerTemplate("homeAirportItem-template");
            this.kmRangeSelected = 200;
            Views.AirLoc.registerLocationCombo($("#currentCity"), function (place) {
                _this.updateLoc(place.City, place.CountryCode);
            });
            this.regRangeCombo();
            this.$airportsCont = $("#airportsCont");
            this.$airContS = $(".top-ribbon .airports");
            this.initAirports();
            this.loadMgmtAirports();
            $(".top-ribbon .edit").click(function (e) {
                e.preventDefault();
                $(".location-dialog").toggleClass("hidden");
                _this.hideRefresh();
            });
            $("#airClose").click(function (e) {
                e.preventDefault();
                $(".location-dialog").addClass("hidden");
                _this.hideRefresh();
            });
            $("#refreshResults").click(function (e) {
                e.preventDefault();
                _this.hideRefresh();
            });
        }
        Object.defineProperty(LocationSettingsDialog.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        LocationSettingsDialog.prototype.updateLoc = function (city, cc) {
            $("#rangeBlock").removeClass("hidden");
            $(".home-location-name").html(city + ", (" + cc + ")");
        };
        LocationSettingsDialog.prototype.hideRefresh = function () {
            $(".refresh-line").addClass("hidden");
        };
        LocationSettingsDialog.prototype.changed = function () {
            if (this.hasAirports()) {
                $(".no-airs-info").hide();
            }
        };
        LocationSettingsDialog.prototype.loadMgmtAirports = function () {
            var _this = this;
            this.v.apiGet("airportRange", null, function (as) {
                _this.generateAirports(as);
            });
        };
        LocationSettingsDialog.prototype.initAirports = function () {
            var _this = this;
            var ac = new Trip.AirportCombo("airportCombo", { clearAfterSelection: true });
            ac.onSelected = function (e) {
                var data = { airportId: e.id };
                _this.v.apiPost("airportRange", data, function (a) {
                    _this.genAirport(a);
                    _this.genAirportS(a.airCode);
                    _this.changed();
                });
            };
        };
        LocationSettingsDialog.prototype.hasAirports = function () {
            return $("#airportsCont").find(".airport").length > 0;
        };
        LocationSettingsDialog.prototype.regRangeCombo = function () {
            var _this = this;
            var $dd = $("#airportsRange");
            $dd.change(function (e) {
                var kms = parseInt($dd.find("input").val());
                _this.kmRangeSelected = kms;
            });
            $("#addAirsRange").click(function (e) {
                e.preventDefault();
                _this.callAirportsByRange();
            });
        };
        LocationSettingsDialog.prototype.callAirportsByRange = function () {
            var _this = this;
            var data = { distance: this.kmRangeSelected };
            this.v.apiPut("AirportRange", data, function (airports) {
                _this.generateAirports(airports);
                _this.changed();
            });
        };
        LocationSettingsDialog.prototype.generateAirports = function (airports) {
            var _this = this;
            this.$airportsCont.find(".airport").remove();
            this.$airContS.empty();
            airports.forEach(function (a) {
                _this.genAirport(a);
                _this.genAirportS(a.airCode);
            });
        };
        LocationSettingsDialog.prototype.genAirportS = function (code) {
            var $h = $("<span id=\"s_" + code + "\" class=\"airport\">" + code + "</span>");
            this.$airContS.append($h);
        };
        LocationSettingsDialog.prototype.genAirport = function (a) {
            var _this = this;
            var context = {
                id: a.origId,
                city: a.city,
                airCode: a.airCode,
                airName: a.airName
            };
            var $html = $(this.airTemplate(context));
            $html.find(".delete").click(function (e) {
                var $c = $(e.target).parent();
                var id = $c.attr("id");
                var code = $c.data("code");
                var data = [["id", id]];
                Views.ViewBase.currentView.apiDelete("AirportRange", data, function (as) {
                    $("#" + id).remove();
                    $("#s_" + code).remove();
                    _this.changed();
                });
            });
            this.$airportsCont.prepend($html);
        };
        return LocationSettingsDialog;
    }());
    Planning.LocationSettingsDialog = LocationSettingsDialog;
})(Planning || (Planning = {}));
//# sourceMappingURL=LocationSettingsDialog.js.map