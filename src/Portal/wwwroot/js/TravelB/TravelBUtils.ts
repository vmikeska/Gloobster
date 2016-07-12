module TravelB {
	export class TravelBUtils {
		public static waitingMins(waitingUntil) {
			var now = new Date();
			var untilDate = new Date(waitingUntil);
			var nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
			var untilUtc = new Date(untilDate.getUTCFullYear(), untilDate.getUTCMonth(), untilDate.getUTCDate(), untilDate.getUTCHours(), untilDate.getUTCMinutes(), untilDate.getUTCSeconds());
			var dd = Math.abs(nowUtc.getTime() - untilUtc.getTime());
			var diffMins = Math.ceil(dd / (1000 * 60));
			return diffMins;
		}

			public static i(id, text) {
				return { id: id, text: text };
			}

		public static wantDoDB() {
			return [
				TravelBUtils.i(0, "Walking tour"),
				TravelBUtils.i(1, "Bar or Pub"),
				TravelBUtils.i(2, "Date"),
				TravelBUtils.i(3, "Sport")
			];
		}

		public static interestsDB() {

				return [
						TravelBUtils.i(0, "Traveling"),
						TravelBUtils.i(1, "Partying"),
						TravelBUtils.i(2, "Sport"),
						TravelBUtils.i(3, "Drinking"),
						TravelBUtils.i(2, "Eating")
				];			
		}

		public static langsDB() {
			return [
				TravelBUtils.i("en", "English"),
				TravelBUtils.i("de", "German"),
				TravelBUtils.i("cz", "Czech"),
				TravelBUtils.i("es", "Spanish"),
				TravelBUtils.i("pt", "Portuguese"),
				TravelBUtils.i("fr", "French")
			];
		}
	}
}