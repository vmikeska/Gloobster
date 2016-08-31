module Views {
	export class AggregatedCountries {
		public africa = ["DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GW", "GN", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SD", "SZ", "TG", "TN", "UG", "ZM", "TZ", "ZW", "SS", "CD"];
		public europe = ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FO", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "MC", "NL", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "ME"];
		public asia = ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP", "KR", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PH", "QA", "SA", "SG", "LK", "SY", "TJ", "TH", "TR", "TM", "AE", "UZ", "VN", "YE"];
		public austraila = ["AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "SB", "TO", "TV", "VU", "WS", "TL"];
		public northAmerica = ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"];
		public southAmerica = ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"];
		public eu = ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE", "UK"];
		private us = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MH", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];

		public africaTotal = 54;
		public europeTotal = 45;
		public asiaTotal = 45;
		public australiaTotal = 15;
		public northAmericaTotal = 22;
		public southAmericaTotal = 12;
		public euTotal = 28;
		public usTotal = 50;

		public africaVisited = 0;
		public europeVisited = 0;
		public asiaVisited = 0;
		public australiaVisited = 0;
		public northAmericaVisited = 0;
		public southAmericaVisited = 0;
		public euVisited = 0;
		public usVisited = 0;

		public aggregateUs(states) {
			states.forEach((c) => {
				var eu = _.contains(this.us, c);
				if (eu) {
					this.usVisited++;
				}
			});
		}

		public aggregate(countries) {			
			countries.forEach((c) => {
				var af = _.contains(this.africa, c);
				if (af) {
					this.africaVisited++;
				}

				var eur = _.contains(this.europe, c);
				if (eur) {
					this.europeVisited++;
				}

				var asi = _.contains(this.asia, c);
				if (asi) {
					this.asiaVisited++;
				}

				var aus = _.contains(this.austraila, c);
				if (aus) {
					this.australiaVisited++;
				}

				var na = _.contains(this.northAmerica, c);
				if (na) {
					this.northAmericaVisited++;
				}

				var sa = _.contains(this.southAmerica, c);
				if (sa) {
					this.southAmericaVisited++;
				}

				var eu = _.contains(this.eu, c);
				if (eu) {
					this.euVisited++;
				}


			});
		}
	}
}