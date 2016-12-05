var Planning;
(function (Planning) {
    var FlightConvert = (function () {
        function FlightConvert() {
        }
        FlightConvert.cFlights = function (fs) {
            var _this = this;
            var flights = [];
            fs.forEach(function (f) {
                var flight = _this.cFlight(f);
                flights.push(flight);
            });
            return flights;
        };
        FlightConvert.cFlight = function (f) {
            var _this = this;
            var flight = {
                from: f.From,
                to: f.To,
                price: f.Price,
                score: f.FlightScore,
                parts: []
            };
            f.FlightParts.forEach(function (p) {
                var part = _this.cPart(p);
                flight.parts.push(part);
            });
            return flight;
        };
        FlightConvert.cPart = function (p) {
            var part = {
                depTime: new Date(p.DeparatureTime),
                arrTime: new Date(p.ArrivalTime),
                from: p.From,
                to: p.To,
                airline: p.Airline,
                minsDuration: p.MinsDuration,
                flightNo: p.FlightNo
            };
            return part;
        };
        return FlightConvert;
    }());
    Planning.FlightConvert = FlightConvert;
})(Planning || (Planning = {}));
//# sourceMappingURL=Convert.js.map