var Views;
(function (Views) {
    var LocationSettingsDialog = (function () {
        function LocationSettingsDialog(v) {
            var _this = this;
            this.airTemplate = Views.ViewBase.currentView.registerTemplate("homeAirportItem-template");
            this.kmRangeSelected = 200;
            this.v = v;
            Views.AirLoc.registerLocationCombo($("#currentCity"), function (place) {
                $("#rangeBlock").removeClass("hidden");
                $(".home-location-name").html(place.City + ", (" + place.CountryCode + ")");
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
                _this.v.resultsEngine.refresh();
                _this.hideRefresh();
            });
        }
        LocationSettingsDialog.prototype.hideRefresh = function () {
            $(".refresh-line").addClass("hidden");
        };
        LocationSettingsDialog.prototype.changed = function () {
            var sel = this.v.planningMap.map.anySelected();
            if (sel) {
                $(".refresh-line").removeClass("hidden");
            }
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
    Views.LocationSettingsDialog = LocationSettingsDialog;
})(Views || (Views = {}));
//# sourceMappingURL=LocationSettingsDialog.js.map