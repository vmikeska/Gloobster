module Planning {
		
		export class AnytimeByContinentAgg {

				public europe = [];
				public nAmerica = [];
				public sAmerica = [];
				public asia = [];
				public africa = [];
				public australia = [];

			public connections;
				
			private cg = Common.CountriesGroup;

			constructor(connections) {
					this.connections = connections;
			}

			public getAllConts() {
				return {
					europe: this.europe,
					nAmerica: this.nAmerica,
					sAmerica: this.sAmerica,
					asia: this.asia,
					africa: this.africa,
					australia: this.australia
				};
			}

			public exe(starsLevel: number) {
										
					var ca = new AnytimeByCountryAgg(this.connections);
					ca.exe(starsLevel);

					ca.countries.forEach((c) => {
							
							if (this.contains(c.cc, this.cg.europe) ) {
								this.europe.push(c);
							}

							if (this.contains(c.cc, this.cg.northAmerica)) {
									this.nAmerica.push(c);
							}

							if (this.contains(c.cc, this.cg.southAmerica)) {
									this.sAmerica.push(c);
							}

							if (this.contains(c.cc, this.cg.asia)) {
									this.asia.push(c);
							}

							if (this.contains(c.cc, this.cg.africa)) {
									this.africa.push(c);
							}

							if (this.contains(c.cc, this.cg.austraila)) {
									this.australia.push(c);
							}

					});
					
			}

				private contains(ccIn, ccs) {
						var conts = _.contains(ccs, ccIn);
					return conts;
				}
				
		}
		
}