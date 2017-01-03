module Planning {
		
	export class FlightsExtractor {
		//flight, result, query
		public static f(queries, callback) {
			queries.forEach((q) => {
				q.results.forEach((r) => {
					r.fs.forEach((f) => {
						callback(f, r, q);
					});
				});
			});
		}


		public static r(queries, callback) {
			queries.forEach((q) => {
				q.results.forEach((r) => {
					callback(r, q);
				});
			});
		}

		public static getResults(queries) {
			var res = [];
			this.r(queries, (r) => { res.push(r); });
			return res;
		}
	}

	
		
}