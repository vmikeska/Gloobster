module Trip {
	export class Utils {
		public static dateStringToUtcDate(dateStr: string): Date {
			var dateLocal = new Date(Date.parse(dateStr));
			var userOffset = dateLocal.getTimezoneOffset() * 60000;
			var utcTime = new Date(dateLocal.getTime() + userOffset);
			return utcTime;
		}

		public static dateToUtcDate(dateLocal: Date): Date {
			var userOffset = dateLocal.getTimezoneOffset() * 60000;
			var localUtcTime = new Date(dateLocal.getTime() - userOffset);

			var utcDate = new Date(Date.UTC(localUtcTime.getUTCFullYear(), localUtcTime.getUTCMonth(), localUtcTime.getUTCDate()));
			return utcDate;
		}
	}
}