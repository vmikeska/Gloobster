module TravelB {

		export enum WantMeet { Man, Woman, All } 

	export class Status {

		private template;

		constructor() {
			this.template = Views.ViewBase.currentView.registerTemplate("status-template");
		}

		public refresh() {
			var $checkinRow = $(".checkin-row");
				
			Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "me"]], (r) => {

					if (!r) {
						$checkinRow.show();						
					return;
				}

				var context = {
						placeName: r.waitingAtText,
						placeLink: Common.GlobalUtils.getSocLink(r.waitingAtType, r.waitingAtId),

						wmMan: ((r.wantMeet === WantMeet.Man) || (r.wantMeet === WantMeet.All)),
						wmWoman: ((r.wantMeet === WantMeet.Woman) || (r.wantMeet === WantMeet.All)), 
						wmWomanGroup: ((r.wantMeet === WantMeet.Woman) && r.multiPeopleAllowed), 
						wmManGroup: ((r.wantMeet === WantMeet.Man) && r.multiPeopleAllowed),
						wmMixGroup: ((r.wantMeet === WantMeet.All) && r.multiPeopleAllowed),
						
						wantDos: Views.StrOpers.getActivityStrArray(r.wantDo)
					}
					
				var $html = $(this.template(context));
				$html.find(".edit").click((e) => {
					e.preventDefault();
					this.editClick();
				});
				$checkinRow.after($html);
				
			});
		}

		private editClick() {
			var win = new CheckinWin();
			win.showNowCheckin();
		}
	}
}