module TravelB {
	export class Status {

		private template;

		constructor() {
			this.template = Views.ViewBase.currentView.registerTemplate("status-template");
		}

		public refresh() {
			var $cont = $("#statusCont");

			Views.ViewBase.currentView.apiGet("TravelBCheckin", [["me", "true"]], (r) => {

				if (!r) {
					$cont.html("No status");
				}

				var context = {
					placeName: r.waitingAtText,
					wantMeetName: Views.TravelBView.getGenderStr(r.wantMeet),
					wantDoName: Views.TravelBView.getActivityStr(r.wantDo)
				}

				var $html = $(this.template(context));
				$html.click((e) => {
					e.preventDefault();
					this.editClick();
				});
				$cont.html($html);

			});
		}

		private editClick() {
			var win = new CheckinWin();
			win.showCheckinWin(false);
		}
	}
}