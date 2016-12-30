module TravelB {
	export class DateUtils {
			
		public static myDateToStr(myDate) {
			return `${myDate.Day}.${myDate.Month}.${myDate.Year}`;
		}

		public static myDateToTrans(myDate) {
			return `${myDate.Day}_${myDate.Month}_${myDate.Year}`;
		}
			
		public static myDateToJsDate(myDate) {
			return new Date(myDate.Year, myDate.Month - 1, myDate.Day);
		}

		public static myDateToMomentDate(myDate) {
				if (!myDate) {
						return null;
				}

				return moment([myDate.Year, myDate.Month -1, myDate.Day]);
		}

		public static momentDateToTrans(mDate) {
				return `${mDate.date()}_${mDate.month() + 1}_${mDate.year()}`;
		}

			public static momentDateToMyDate(mDate) {
					if (!mDate) {
						return null;
					}

					return {
							Year: mDate.year(),
							Month: mDate.month() + 1,
							Day: mDate.date()
					};
			}

		public static jsDateToMyDate(date) {
			return {
				Year: date.getFullYear(),
				Month: date.getMonth() + 1,
				Day: date.getDate()
			};
		}

	}
}