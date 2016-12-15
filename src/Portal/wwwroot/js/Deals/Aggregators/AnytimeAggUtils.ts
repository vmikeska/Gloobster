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

	export class AnytimeAggUtils {


			public static checkFilter(flight, starsLevel: number) {
				var scoreOk = this.matchesScore(flight, starsLevel);
			return scoreOk;
		}

		public static matchesScore(flight, starsLevel) {
			if (starsLevel === 1) {
				return true;
			}

			var stars = this.getScoreStars(flight.score);
			if ((starsLevel === 5) && _.contains([5, 4], stars)) {
				return true;
			}
			if ((starsLevel === 3) && _.contains([5, 4, 3, 2], stars)) {
				return true;
			}

			return false;
		}

		public static getScoreStars(index) {
				var percents = index * 100;
				
				if (percents >= 90) {
					return 5;
				}
				if (percents >= 80) {
						return 4;
				}
				if (percents >= 70) {
						return 3;
				}
				if (percents >= 60) {
						return 2;
				}

				return 1;				
		}
	}
		
}