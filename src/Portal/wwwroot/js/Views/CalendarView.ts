module Views {
	export class CalendarView extends ViewBase {
			
			private $calendar;

			constructor() {
					super();

				this.init();
			}

			private init() {
				this.createCalendar();
			}


		private createCalendar() {

			var __this = this;

			var $c = $("#calendar")
				.fullCalendar({
					header: { left: "title", right: "prev,next" },
					footer: false,
					navLinks: false,
					editable: false,
					eventLimit: true,
					fixedWeekCount: false,
					viewRender(view, element) {
						__this.showData(view);
					},
					eventClick(evnt) {
						window.open(`/trip/${evnt.tripId}`, "_blank");							
					}
					});

			this.$calendar = $c;
		}
			
		private showData(view) {
				
			view.calendar.removeEvents();
			
			var tFrom = TravelB.DateUtils.momentDateToTrans(view.start);
			var tTo = TravelB.DateUtils.momentDateToTrans(view.end);

			var prms = [["from", tFrom], ["to", tTo]];

			this.apiGet("FriendsEvents", prms, (events) => {
					var evnts = _.map(events, (event) => { return Dashboard.CalendarUtils.convertEvent(event) });

					evnts.forEach((evnt) => {
						this.$calendar.fullCalendar("renderEvent", evnt);
					});

				});
		}

	}
}