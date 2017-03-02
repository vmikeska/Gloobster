var Planning;
(function (Planning) {
    var FlightConvert2 = (function () {
        function FlightConvert2() {
        }
        FlightConvert2.cFlights = function (fs) {
            var _this = this;
            var flights = [];
            fs.forEach(function (f) {
                var flight = _this.cFlight(f);
                flights.push(flight);
            });
            return flights;
        };
        FlightConvert2.cFlight = function (f) {
            var _this = this;
            var flight = {
                from: f.from,
                to: f.to,
                price: f.price,
                score: f.score,
                parts: [],
                bookLink: f.bl,
                stars: 0,
                scoreOk: true
            };
            f.parts.forEach(function (p) {
                var part = _this.cPart(p);
                flight.parts.push(part);
            });
            return flight;
        };
        FlightConvert2.cPart = function (p) {
            var part = {
                depTime: new Date(p.dep),
                arrTime: new Date(p.arr),
                from: p.from,
                to: p.to,
                airline: p.air,
                minsDuration: p.mins,
                flightNo: p.no
            };
            return part;
        };
        return FlightConvert2;
    }());
    Planning.FlightConvert2 = FlightConvert2;
})(Planning || (Planning = {}));
//# sourceMappingURL=Convert.js.map