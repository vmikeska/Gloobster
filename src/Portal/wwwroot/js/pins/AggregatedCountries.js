var Views;
(function (Views) {
    var AggregatedCountries = (function () {
        function AggregatedCountries() {
            this.africaTotal = 54;
            this.europeTotal = 45;
            this.asiaTotal = 45;
            this.australiaTotal = 15;
            this.northAmericaTotal = 22;
            this.southAmericaTotal = 12;
            this.euTotal = 28;
            this.usTotal = 50;
            this.africaVisited = 0;
            this.europeVisited = 0;
            this.asiaVisited = 0;
            this.australiaVisited = 0;
            this.northAmericaVisited = 0;
            this.southAmericaVisited = 0;
            this.euVisited = 0;
            this.usVisited = 0;
            this.cc = Common.CountriesGroup;
        }
        AggregatedCountries.prototype.aggregateUs = function (states) {
            var _this = this;
            states.forEach(function (c) {
                var eu = _.contains(_this.cc.us, c);
                if (eu) {
                    _this.usVisited++;
                }
            });
        };
        AggregatedCountries.prototype.aggregate = function (countries) {
            var _this = this;
            countries.forEach(function (c) {
                var af = _.contains(_this.cc.africa, c);
                if (af) {
                    _this.africaVisited++;
                }
                var eur = _.contains(_this.cc.europe, c);
                if (eur) {
                    _this.europeVisited++;
                }
                var asi = _.contains(_this.cc.asia, c);
                if (asi) {
                    _this.asiaVisited++;
                }
                var aus = _.contains(_this.cc.austraila, c);
                if (aus) {
                    _this.australiaVisited++;
                }
                var na = _.contains(_this.cc.northAmerica, c);
                if (na) {
                    _this.northAmericaVisited++;
                }
                var sa = _.contains(_this.cc.southAmerica, c);
                if (sa) {
                    _this.southAmericaVisited++;
                }
                var eu = _.contains(_this.cc.eu, c);
                if (eu) {
                    _this.euVisited++;
                }
            });
        };
        return AggregatedCountries;
    }());
    Views.AggregatedCountries = AggregatedCountries;
})(Views || (Views = {}));
//# sourceMappingURL=AggregatedCountries.js.map