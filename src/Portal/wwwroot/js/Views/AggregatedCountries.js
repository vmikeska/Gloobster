var Views;
(function (Views) {
    var AggregatedCountries = (function () {
        function AggregatedCountries() {
            this.africa = ["DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GW", "GN", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SD", "SZ", "TG", "TN", "UG", "ZM", "TZ", "ZW", "SS", "CD"];
            this.europe = ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FO", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "MC", "NL", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "ME"];
            this.asia = ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP", "KR", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PH", "QA", "SA", "SG", "LK", "SY", "TJ", "TH", "TR", "TM", "AE", "UZ", "VN", "YE"];
            this.austraila = ["AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "SB", "TO", "TV", "VU", "WS", "TL"];
            this.northAmerica = ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"];
            this.southAmerica = ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"];
            this.eu = ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE", "UK"];
            this.us = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MH", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];
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
        }
        AggregatedCountries.prototype.aggregateUs = function (states) {
            var _this = this;
            states.forEach(function (c) {
                var eu = _.contains(_this.us, c);
                if (eu) {
                    _this.usVisited++;
                }
            });
        };
        AggregatedCountries.prototype.aggregate = function (countries) {
            var _this = this;
            countries.forEach(function (c) {
                var af = _.contains(_this.africa, c);
                if (af) {
                    _this.africaVisited++;
                }
                var eur = _.contains(_this.europe, c);
                if (eur) {
                    _this.europeVisited++;
                }
                var asi = _.contains(_this.asia, c);
                if (asi) {
                    _this.asiaVisited++;
                }
                var aus = _.contains(_this.austraila, c);
                if (aus) {
                    _this.australiaVisited++;
                }
                var na = _.contains(_this.northAmerica, c);
                if (na) {
                    _this.northAmericaVisited++;
                }
                var sa = _.contains(_this.southAmerica, c);
                if (sa) {
                    _this.southAmericaVisited++;
                }
                var eu = _.contains(_this.eu, c);
                if (eu) {
                    _this.euVisited++;
                }
            });
        };
        return AggregatedCountries;
    })();
    Views.AggregatedCountries = AggregatedCountries;
})(Views || (Views = {}));
//# sourceMappingURL=AggregatedCountries.js.map