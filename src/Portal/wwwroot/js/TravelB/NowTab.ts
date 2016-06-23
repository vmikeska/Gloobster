module TravelB {
	export class NowTab {

		public onPlacesCheckins: Function;
		public onMeetingPoints: Function;
		public onBeforeSwitch: Function;

		public tabs;

		public peopleTabConst = "people";
		public mpTabConst = "meetingPoints";

		private checkinTemplate;
		private mpTemplate;

		constructor() {
				this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinNowItem-template");				
				this.mpTemplate = Views.ViewBase.currentView.registerTemplate("meetingPointItem-template");
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
			$listCont.html("");

			points.forEach((p) => {

					var context = {
							sourceId: p.sourceId,
							type: p.type,
							name: p.text,
							link: "abcd"
					};

					var $u = $(this.mpTemplate(context));
					$listCont.append($u);
			});				

		}


		public genCheckinsList(checkins) {

			var $listCont = $("#listCont");
			$listCont.html("");
				
			var d = new Date();
			var curYear = d.getFullYear();

			var cr = new CheckinReact();

			checkins.forEach((p) => {

				var context = {
					id: p.userId,
					name: p.displayName,
					age: curYear - p.birthYear,
					waitingFor: Views.TravelBView.getGenderStr(p.wantMeet),
					wants: Views.TravelBView.getActivityStr(p.wantDo)
				};

				var $u = $(this.checkinTemplate(context));
				$u.find(".startChatBtn").click((e) => {
						e.preventDefault();
						cr.askForChat(p);
				});
				$listCont.append($u);
			});				
		}

		}

	export class CheckinReact {
		public askForChat(checkin) {
			var data = { uid: checkin.userId, cid: checkin.id };

			Views.ViewBase.currentView.apiPost("CheckinReact", data, () => {
				var id = new Common.InfoDialog();
				id.create("Request sent", "You asked to start chat with the user, now you have to wait until he confirms the chat");
			});

		}
	}
}