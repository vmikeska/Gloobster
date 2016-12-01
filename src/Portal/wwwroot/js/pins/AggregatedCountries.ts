module Views {
	export class AggregatedCountries {
		
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

		private cc = Common.CountriesGroup;

		public aggregateUs(states) {
			states.forEach((c) => {
				var eu = _.contains(this.cc.us, c);
				if (eu) {
					this.usVisited++;
				}
			});
		}

		public aggregate(countries) {
				
			countries.forEach((c) => {
					var af = _.contains(this.cc.africa, c);
				if (af) {
					this.africaVisited++;
				}

				var eur = _.contains(this.cc.europe, c);
				if (eur) {
					this.europeVisited++;
				}

				var asi = _.contains(this.cc.asia, c);
				if (asi) {
					this.asiaVisited++;
				}

				var aus = _.contains(this.cc.austraila, c);
				if (aus) {
					this.australiaVisited++;
				}

				var na = _.contains(this.cc.northAmerica, c);
				if (na) {
					this.northAmericaVisited++;
				}

				var sa = _.contains(this.cc.southAmerica, c);
				if (sa) {
					this.southAmericaVisited++;
				}

				var eu = _.contains(this.cc.eu, c);
				if (eu) {
					this.euVisited++;
				}


			});
		}
	}
}