module TravelB {
	export class HereAndNowTab {

		public onPlacesCheckins: Function;
		public onMeetingPoints: Function;
		public onBeforeSwitch: Function;

		public tabs;

		public peopleTabConst = "people";
		public mpTabConst = "meetingPoints";

		private userTemplate;

		constructor() {

			this.userTemplate = Views.ViewBase.currentView.registerTemplate("checkinUserItem-template");				
		}

		public createTab() {
				this.tabs = new Tabs($("#hereTabs"), "hereAndNow", 40);

				this.tabs.onBeforeSwitch = () => {
						$("#listCont").html("");
					this.onBeforeSwitch();
				}

				this.tabs.addTab(this.peopleTabConst, "People", () => {
					this.onPlacesCheckins();
				});
				this.tabs.addTab(this.mpTabConst, "Meeting points", () => {
					this.onMeetingPoints();
				});
				this.tabs.create();
		}

			public genMeetingPoints(points) {
					var $listCont = $("#listCont");
					$listCont.html("meeting points");
			}


		public genPeopleList(checkins) {

			var $listCont = $("#listCont");
			$listCont.html("");
				
			var d = new Date();
			var curYear = d.getFullYear();

			checkins.forEach((p) => {

					var context = {
						id: p.userId,
					name: p.displayName,
					age: curYear - p.birthYear,
					waitingFor: Views.TravelBView.getGenderStr(p.wantMeet),
					wants: Views.TravelBView.getActivityStr(p.wantDo)
				}

				var $u = $(this.userTemplate(context));
				$listCont.append($u);
			});


		}

	}
}