module Planning {

	export class DelasEval {

		private timeType: PlanningType;
		private queries;

		public res = { Excellent: 0, Good: 0, Standard: 0 };

		constructor(timeType: PlanningType, queries) {
			this.timeType = timeType;
			this.queries = queries;
		}
			
		public countDeals() {
				FlightsExtractor.f(this.queries, (f, r, q) => {
						var stars = AnytimeAggUtils.getScoreStars(f.score);
						this.incCategory(stars);
				});				
		}

		private incCategory(stars) {
			if (stars >= 4) {
				this.res.Excellent++;
			} else if (stars >= 2) {
				this.res.Good++;
			} else {
				this.res.Standard++;
			}
		}


		public dispayDeals() {
			this.countDeals();

			$("#delasEx").html(this.res.Excellent);
			$("#delasGo").html(this.res.Good);
			$("#delasSt").html(this.res.Standard);
		}
	}
		
}