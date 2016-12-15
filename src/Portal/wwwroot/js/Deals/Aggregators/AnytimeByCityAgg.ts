module Planning {
		
	export class AnytimeByCityAgg {

			public cities = [];

			public queries;

			constructor(queries) {
					this.queries = queries;
			}
			
			public exe(starsLevel) {
					
					FlightsExtractor.r(this.queries, (r, q) => {

						var passed = [];

						r.fs.forEach((f) => {
								var ok = AnytimeAggUtils.checkFilter(f, starsLevel);
								if (ok) { passed.push(f); }
						});

						if (any(passed)) {
							var city = this.getOrCreateCity(r.gid, r.name, r.cc);

							var bestFlight = {
								from: r.from,
								to: r.to,
								price: _.min(_.map(passed, (pf) => { return pf.price }))
							}

							city.bestFlights.push(bestFlight);

							if (!city.fromPrice) {
								city.fromPrice = bestFlight.price;
							} else if (city.fromPrice > bestFlight.price) {
								city.fromPrice = bestFlight.price;
							}
						}
					});					
		}
			
			private getOrCreateCity(gid, name, cc) {

					var city = _.find(this.cities, (c) => { return c.gid === gid });

					if (!city) {
							city = {
									gid: gid,
									name: name,
									cc: cc,
									fromPrice: null,
									bestFlights: []
							};

							this.cities.push(city);
					}

					return city;
			}

	}


}