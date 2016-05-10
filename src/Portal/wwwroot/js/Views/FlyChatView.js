var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var FlyChatView = (function (_super) {
        __extends(FlyChatView, _super);
        function FlyChatView() {
            var _this = this;
            _super.call(this);
            $("#btnCall").click(function (e) {
                e.preventDefault();
                _this.getResults();
            });
        }
        FlyChatView.prototype.getResults = function () {
            var _this = this;
            var fromPlace = $("#FromPlace").val();
            var toPlace = $("#ToPlace").val();
            var deparature = $("#Deparature").val();
            var ret = $("#Return").val();
            var directFlight = $("#DirectFlight").val();
            var daysInDestinationFrom = $("#DaysInDestinationFrom").val();
            var typeFlight = $("#TypeFlight").val();
            var data = [["FromPlace", fromPlace], ["ToPlace", toPlace], ["Deparature", deparature], ["Return", ret],
                ["DirectFlight", directFlight], ["DaysInDestinationFrom", daysInDestinationFrom], ["TypeFlight", typeFlight]];
            this.apiGet("SkypickerTicket", data, function (r) {
                _this.generateFlights(r);
            });
        };
        FlyChatView.prototype.generateFlights = function (flights) {
            var _this = this;
            var $cont = $("#results");
            $cont.html("");
            flights.forEach(function (flight) {
                var $flight = _this.generateFlight(flight);
                $cont.append($flight);
            });
        };
        FlyChatView.prototype.generateFlight = function (flight) {
            var _this = this;
            var $base = $("<table></table>");
            var items = ["From", "To", "Price", "Stops", "HoursLength", "FlightPartsStr"];
            items.forEach(function (item) {
                var $item = _this.generateItem(flight, item);
                $base.append($item);
            });
            return $base;
        };
        FlyChatView.prototype.generateItem = function (flight, name) {
            return $("<tr><td>" + name + "</td><td>" + flight[name] + "</td></tr>");
        };
        return FlyChatView;
    }(Views.ViewBase));
    Views.FlyChatView = FlyChatView;
})(Views || (Views = {}));
//# sourceMappingURL=FlyChatView.js.map