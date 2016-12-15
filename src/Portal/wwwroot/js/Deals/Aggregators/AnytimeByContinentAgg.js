var Planning;
(function (Planning) {
    var AnytimeByContinentAgg = (function () {
        function AnytimeByContinentAgg(queries) {
            this.europe = [];
            this.nAmerica = [];
            this.sAmerica = [];
            this.asia = [];
            this.africa = [];
            this.australia = [];
            this.cg = Common.CountriesGroup;
            this.queries = queries;
        }
        AnytimeByContinentAgg.prototype.getAllConts = function () {
            return {
                europe: this.europe,
                nAmerica: this.nAmerica,
                sAmerica: this.sAmerica,
                asia: this.asia,
                africa: this.africa,
                australia: this.australia
            };
        };
        AnytimeByContinentAgg.prototype.exe = function (starsLevel) {
            var _this = this;
            var ca = new Planning.AnytimeByCountryAgg(this.queries);
            ca.exe(starsLevel);
            ca.countries.forEach(function (c) {
                if (_this.contains(c.cc, _this.cg.europe)) {
                    _this.europe.push(c);
                }
                if (_this.contains(c.cc, _this.cg.northAmerica)) {
                    _this.nAmerica.push(c);
                }
                if (_this.contains(c.cc, _this.cg.southAmerica)) {
                    _this.sAmerica.push(c);
                }
                if (_this.contains(c.cc, _this.cg.asia)) {
                    _this.asia.push(c);
                }
                if (_this.contains(c.cc, _this.cg.africa)) {
                    _this.africa.push(c);
                }
                if (_this.contains(c.cc, _this.cg.austraila)) {
                    _this.australia.push(c);
                }
            });
        };
        AnytimeByContinentAgg.prototype.contains = function (ccIn, ccs) {
            var conts = _.contains(ccs, ccIn);
            return conts;
        };
        return AnytimeByContinentAgg;
    }());
    Planning.AnytimeByContinentAgg = AnytimeByContinentAgg;
})(Planning || (Planning = {}));
//# sourceMappingURL=AnytimeByContinentAgg.js.map