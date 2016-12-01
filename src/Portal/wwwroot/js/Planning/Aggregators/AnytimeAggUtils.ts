module Planning {

	export class AnytimeAggUtils {


			public static checkFilter(flight, starsLevel: number) {
				var scoreOk = this.matchesScore(flight, starsLevel);
			return scoreOk;
		}

		private static matchesScore(flight, starsLevel) {
			if (starsLevel === 1) {
				return true;
			}

			var stars = this.getScoreStars(flight.FlightScore);
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

		//var daysOk = this.daysFilter(flight, daysFrom, daysTo);

			//private static getFlightDays(flight) {
			//		var fp = _.first(flight.FlightParts);
			//		var lp = _.last(flight.FlightParts);
			//		var f = fp.DeparatureTime;
			//		var t = lp.ArrivalTime;

			//		var fd = new Date(f);
			//		var td = new Date(t);
			//		var timeDiff = Math.abs(td.getTime() - fd.getTime());
			//		var days = Math.ceil(timeDiff / (1000 * 3600 * 24));

			//		return { from: f, to: t, days: days };
			//}

			//private static daysFilter(flight, daysFrom, daysTo) {
			//		var fd = this.getFlightDays(flight);

			//		var fits = daysFrom === null || ((fd.days >= daysFrom) && (fd.days <= daysTo));
			//		return fits;
			//}
	}
		
}