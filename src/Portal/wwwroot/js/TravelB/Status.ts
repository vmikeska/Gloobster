module TravelB {
	export class Status {

		private template;

		constructor() {
			this.template = Views.ViewBase.currentView.registerTemplate("status-template");
		}

		public refresh() {
			var $cont = $("#statusCont");

			Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "me"]], (r) => {

				if (!r) {
						$cont.html("No status");
					return;
				}

				var context = {
					placeName: r.waitingAtText,
					wantMeetName: Views.StrOpers.getGenderStr(r.wantMeet),
					wantDoName: `(${Views.StrOpers.getActivityStr(r.wantDo)})`
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
			win.showNowCheckin();
		}
	}
}