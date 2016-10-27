var Views;
(function (Views) {
    var LocationSettingsDialog = (function () {
        function LocationSettingsDialog() {
            this.airTemplate = Views.ViewBase.currentView.registerTemplate("homeAirportItem-template");
            this.kmRangeSelected = 200;
            this.regLocCombo("currentCity", "CurrentLocation");
            this.regRangeCombo();
            this.$airportsCont = $("#airportsCont");
            this.$airContS = $(".top-ribbon .airports");
            this.initAirports();
            this.loadMgmtAirports();
            $(".top-ribbon .edit").click(function (e) {
                e.preventDefault();
                $(".location-dialog").toggle();
            });
        }
        LocationSettingsDialog.prototype.loadMgmtAirports = function () {
            var _this = this;
            Views.ViewBase.currentView.apiGet("airportRange", null, function (as) {
                _this.generateAirports(as);
            });
        };
        LocationSettingsDialog.prototype.initAirports = function () {
            var _this = this;
            var ac = new Trip.AirportCombo("airportCombo", { clearAfterSelection: true });
            ac.onSelected = function (e) {
                var data = { airportId: e.id };
                Views.ViewBase.currentView.apiPost("airportRange", data, function (a) {
                    _this.genAirport(a);
                    _this.genAirportS(a.airCode);
                });
            };
        };
        LocationSettingsDialog.prototype.regLocCombo = function (elementId, propertyName) {
            var $c = $("#" + elementId);
            var c = new Common.PlaceSearchConfig();
            c.providers = "2";
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            c.selOjb = $c;
            var box = new Common.PlaceSearchBox(c);
            $c.change(function (e, request, place) {
                var data = { propertyName: propertyName, values: { sourceId: request.SourceId, sourceType: request.SourceType } };
                Views.ViewBase.currentView.apiPut("UserProperty", data, function (res) {
                    $(".home-location-name").html(place.City + ", (" + place.CountryCode + ")");
                });
            });
        };
        LocationSettingsDialog.prototype.regRangeCombo = function () {
            var _this = this;
            var $dd = $("#airportsRange");
            $dd.change(function (e) {
                var kms = parseInt($dd.find("input").val());
                _this.kmRangeSelected = kms;
                _this.callAirportsByRange();
            });
        };
        LocationSettingsDialog.prototype.callAirportsByRange = function () {
            var _this = this;
            var data = { distance: this.kmRangeSelected };
            Views.ViewBase.currentView.apiPut("AirportRange", data, function (airports) {
                _this.generateAirports(airports);
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
                });
            });
            this.$airportsCont.prepend($html);
        };
        return LocationSettingsDialog;
    }());
    Views.LocationSettingsDialog = LocationSettingsDialog;
})(Views || (Views = {}));
//# sourceMappingURL=LocationSettingsDialog.js.map