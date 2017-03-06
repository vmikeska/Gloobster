module Planning {
	
	export class AnytimeAggUtils {
			
			public static enrichMoreLess(lg: Common.ListGenerator, listSize: ListSize = ListSize.Big) {

				if (listSize === ListSize.Big) {
						lg.listLimit = 4;
						lg.listLimitMoreTmp = "flights-list-more-tmp";
						lg.listLimitLessTmp = "flights-list-less-tmp";
						lg.listLimitLast = false;		
				}

				if (listSize === ListSize.Small) {
						lg.listLimit = 5;
						lg.listLimitMoreTmp = "flights-list-more-small-tmp";
						lg.listLimitLessTmp = "flights-list-less-small-tmp";
						lg.listLimitLast = false;
				}
			
		}

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
			if (percents >= 50) {
					return 1;
			}

			return 0;
		}
	}
		
}