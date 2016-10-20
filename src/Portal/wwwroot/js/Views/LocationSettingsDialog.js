var Views;
(function (Views) {
    var LocationSettingsDialog = (function () {
        function LocationSettingsDialog() {
            this.kmRangeSelected = 200;
            this.registerLocationCombo("currentCity", "CurrentLocation");
            this.registerAirportRange();
            this.airTemplate = Views.ViewBase.currentView.registerTemplate("homeAirportItem-template");
            this.$airportsCont = $("#airportsCont");
            this.initAirports();
        }
        LocationSettingsDialog.prototype.initAirports = function () {
            var _this = this;
            Views.ViewBase.currentView.apiGet("airportRange", null, function (airports) {
                _this.generateAirports(airports);
            });
            var airportFrom = new Trip.AirportCombo("airportCombo", { clearAfterSelection: true });
            airportFrom.onSelected = function (evntData) {
                var data = { airportId: evntData.id };
                Views.ViewBase.currentView.apiPost("airportRange", data, function (airport) {
                    _this.generateAirport(airport);
                });
            };
        };
        LocationSettingsDialog.prototype.registerLocationCombo = function (elementId, propertyName) {
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
                    var $loc = $("#currentLocation");
                    $loc.find("strong").text(place.City);
                    $loc.find("span").text(place.CountryCode);
                });
            });
        };
        LocationSettingsDialog.prototype.registerAirportRange = function () {
            var _this = this;
            var $comboRoot = $("#airportsRange");
            $comboRoot.click(function (e) {
                var $li = $(e.target);
                var val = $li.data("vl");
                _this.kmRangeSelected = parseInt(val);
            });
            var $addAirports = $("#addAirports");
            $addAirports.click(function () {
                var data = { distance: _this.kmRangeSelected };
                Views.ViewBase.currentView.apiPut("AirportRange", data, function (airports) {
                    _this.generateAirports(airports);
                });
            });
        };
        LocationSettingsDialog.prototype.generateAirports = function (airports) {
            var _this = this;
            this.$airportsCont.find(".place").remove();
            airports.forEach(function (airport) {
                _this.generateAirport(airport);
            });
        };
        LocationSettingsDialog.prototype.generateAirport = function (airport) {
            var context = { name: airport.selectedName, id: airport.origId };
            var html = this.airTemplate(context);
            var $html = $(html);
            $html.find(".delete").click(function (e) {
                var id = $(e.target).parent().attr("id");
                var data = [["id", id]];
                Views.ViewBase.currentView.apiDelete("AirportRange", data, function (airports) {
                    $("#" + id).remove();
                });
            });
            this.$airportsCont.prepend($html);
        };
        return LocationSettingsDialog;
    }());
    Views.LocationSettingsDialog = LocationSettingsDialog;
})(Views || (Views = {}));
//# sourceMappingURL=LocationSettingsDialog.js.map