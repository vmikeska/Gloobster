module TravelB {
	export class NowTab {

		//public onPlacesCheckins: Function;
		//public onMeetingPoints: Function;
		//public onBeforeSwitch: Function;

		public tabs;

		public peopleTabConst = "people";
		public mpTabConst = "meetingPoints";

		private checkinTemplate;
		private mpTemplate;

		constructor() {
				this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinNowItem-template");				
				this.mpTemplate = Views.ViewBase.currentView.registerTemplate("meetingPointItem-template");
		}

		public genMeetingPoints(points) {
			var $listCont = $(".results .meeting-points");
			$listCont.find(".meeting-point").remove();
				
			var $no = $(".no-mp-all");
			if (points.length > 0) {
					$no.hide();
			} else {
					$no.show();
			}

			points.forEach((p) => {

				var context = {
					sourceId: p.sourceId,
					type: p.type,
					name: p.text,
					link: Common.GlobalUtils.getSocLink(p.type, p.sourceId),
					photoUrl: p.photoUrl,
					categories: p.categories,
					peopleMet: p.peopleMet
				};

				var $u = $(this.mpTemplate(context));

				$u.find(".btn-check").click((e) => {
					e.preventDefault();

					var v = <Views.TravelBView>Views.ViewBase.currentView;
					v.checkinWin.showNowCheckin(() => {
						v.checkinWin.wpCombo.initValues({
							sourceId: p.sourceId,
							sourceType: p.type,
							lastText: p.text,
							coord: p.coord
						});
					});

				});

				$listCont.append($u);
			});

		}


		public genCheckinsList(checkins) {

			var fc = _.reject(checkins, (c) => { return c.userId === Views.ViewBase.currentUserId });

			var $no = $(".no-people-all");
			if (fc.length > 0) {
			  $no.hide();
		  } else {
			  $no.show();
		  }

			var $listCont = $(".results .people");
			$listCont.find(".person").remove();
				
			var d = new Date();
			var curYear = d.getFullYear();

			var cr = new CheckinReact();

			fc.forEach((p) => {

				var context = {
					id: p.userId,
					name: p.displayName,
					age: curYear - p.birthYear,
					languages: Views.StrOpers.langsToFlags(p.languages, p.homeCountry),
					homeCountry: p.homeCountry,
					livesCountry: p.livesCountry,
					livesOtherCountry: p.homeCountry !== p.livesCountry,
					
					wmMan: ((p.wantMeet === WantMeet.Man) || (p.wantMeet === WantMeet.All)),
					wmWoman: ((p.wantMeet === WantMeet.Woman) || (p.wantMeet === WantMeet.All)),
					wmWomanGroup: ((p.wantMeet === WantMeet.Woman) && p.multiPeopleAllowed),
					wmManGroup: ((p.wantMeet === WantMeet.Man) && p.multiPeopleAllowed),
					wmMixGroup: ((p.wantMeet === WantMeet.All) && p.multiPeopleAllowed),
					
					wantDos: Views.StrOpers.getActivityStrArray(p.wantDo),
					message: p.message
					
				};

				var $u = $(this.checkinTemplate(context));
				$u.find(".chat-btn").click((e) => {
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