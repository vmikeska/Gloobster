module Planning {
		
		export class AnytimeByCountryAgg {

			public countries = [];

			public queries;

			constructor(queries) {
					this.queries = queries;
			}

			public exe(starsLevel: number) {

					FlightsExtractor.r(this.queries, (r, q) => {

							var passed = [];

							r.fs.forEach((f) => {
									var ok = AnytimeAggUtils.checkFilter(f, starsLevel);
									if (ok) { passed.push(f); }									
							});

							if (any(passed)) {
									var country = this.getCountry(r.cc, r.cc);
									var city = this.getCity(country, r.gid, r.name);

									var fromPrice = _.min(_.map(passed, (pf) => { return pf.price }));

									if (!country.fromPrice) {
											country.fromPrice = fromPrice;
									} else if (country.fromPrice > fromPrice) {
											country.fromPrice = fromPrice;
									}

									if (!city.fromPrice) {
											city.fromPrice = fromPrice;
									} else if (city.fromPrice > fromPrice) {
											city.fromPrice = fromPrice;
									}	
							}							
					});			
			}
				
			private getCountry(cc, name) {
					var country = _.find(this.countries, (c) => { return c.cc === cc });

					if (!country) {
							country = {
									cc: cc,
									name: name,									
									fromPrice: null,
									cities: []
							};

							this.countries.push(country);
					}

					return country;
			}

			private getCity(country, gid, name) {
				var city = _.find(country.cities, (c) => { return c.gid === gid });

				if (!city) {
					city = {
						gid: gid,
						name: name,
						fromPrice: null
					};

					country.cities.push(city);
				}

				return city;
			}

		}
		
}