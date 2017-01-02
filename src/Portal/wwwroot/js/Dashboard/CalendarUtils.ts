module Dashboard {
		export class CalendarUtils {
				public static convertEvent(event) {

						var start = moment.utc(event.start);
						var end = moment.utc(event.end);

						var e = {
								title: event.name,
								start: this.convDate(start),
								end: this.convDate(end),
								tripId: event.tripId
						};

						return e;
				}

				public static getCalRange($cal) {
						var view = $cal.fullCalendar("getView");
						return { from: view.start, to: view.end };
				}

				public static convDate(date) {
						var d = moment.utc(date);
						var s = d.format("YYYY-MM-DD");
						return s;
				}
		}
}