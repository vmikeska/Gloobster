module TravelB {

		export enum WantMeet { Man, Woman, All } 

	export class Status {

		private template = Views.ViewBase.currentView.registerTemplate("status-template");

		private view: Views.TravelBView;

		constructor(view: Views.TravelBView) {
				this.view = view;			
		}


		public refresh() {
			var $checkinRow = $(".checkin-row");
			var $statusRow = $(".status-row");

			Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "me"]], (r) => {

				if (!r) {
					this.visibilityStatusIsSet(false);
					return;
				}

				$statusRow.remove();

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
					 this.view.checkinMenu.activateTab("check");
				});
				$html.find(".delete").click((e) => {
						e.preventDefault();
					Views.ViewBase.currentView.apiDelete("CheckinNow", [], () => {
							this.visibilityStatusIsSet(false);
					});
				});

				$checkinRow.after($html);
				this.visibilityStatusIsSet(true);
			});
		}

		public visibilityStatusIsSet(isSet: boolean) {
			var $checkinRow = $(".checkin-row");
			var $statusRow = $(".status-row");

			if (isSet) {
				$checkinRow.hide();
				$statusRow.show();
			} else {
				$checkinRow.show();
				$statusRow.remove();
			}
		}
			
	}
}