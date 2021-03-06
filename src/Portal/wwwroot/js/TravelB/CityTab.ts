module TravelB {
	export class CityTab {

		private checkinTemplate;			
			private checkinMgmtTemplate;
			private langsTagger;

			private layoutCreated = false;

			private v: Views.TravelBView;

		constructor(v: Views.TravelBView) {
			this.v = v;
			this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinCityItem-template");
		}

		public genCheckinsList(checkins) {
				
				var $listCont = $(".results .people");
				$listCont.find(".person").remove();

				var $no = $(".no-people-all");
				if (checkins.length > 0) {
						$no.hide();
				} else {
						$no.show();
				}
				
			checkins.forEach((c) => {
					
				var context = CheckinMapping.map(c, CheckinType.City);
					
				var tmp = this.checkinTemplate;

				var $u = $(tmp(context));

				$u.find(".chat-btn").click((e) => {
						e.preventDefault();

						var $t = $(e.target);
						var uid = $t.data("uid");

						this.v.hasFullReg(() => {
								var link = `${window["messagesLink"]}/${uid}`;
								window.open(link, "_blank");
						});

				});


				
				
				$listCont.append($u);
			});
		}

	}
}