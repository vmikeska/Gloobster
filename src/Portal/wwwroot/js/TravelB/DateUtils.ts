module TravelB {
	export class DateUtils {

			//todo: replace moment js
		public static addDays(date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
			}
			
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

		private static datePickerConfig() {
			return {
				dateFormat: "dd.mm.yy"
			};
		}

		public static initDatePicker($datePicker, date, onChange: Function = null) {
			var dpConfig = this.datePickerConfig();

			$datePicker.datepicker(dpConfig);

			if (date) {
				var d = DateUtils.myDateToJsDate(date);
				$datePicker.datepicker("setDate", d);
				$datePicker.data("myDate", date);
			}
				
			$datePicker.change((e) => {
				var $this = $(e.target);
				var date = $this.datepicker("getDate");

				var myDate = DateUtils.jsDateToMyDate(date);
				$datePicker.data("myDate", myDate);
				
				if (onChange) {
					onChange(myDate);
				}				
			});

			
		}
	}
}