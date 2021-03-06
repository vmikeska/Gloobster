module TravelB {
	export class NowTab {

		public tabs;

		public peopleTabConst = "people";
		public mpTabConst = "meetingPoints";

		private checkinTemplate;
		private mpTemplate;

		private v: Views.TravelBView;
			
		constructor(v: Views.TravelBView) {
			this.v = v;

				this.checkinTemplate = this.v.registerTemplate("checkinNowItem-template");				
				this.mpTemplate = this.v.registerTemplate("meetingPointItem-template");
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
					peopleMet: p.peopleMet,
					distance: null
					};


				var l = UserLocation.currentLocation;
				if (l != null) {
						context.distance = Common.GlobalUtils.getDistance(l.lat, l.lng, p.coord.Lat, p.coord.Lng).toFixed(1);						
				}

				var $u = $(this.mpTemplate(context));

				$u.find(".btn-check").click((e) => {
					e.preventDefault();

					
					this.v.checkinWin.showNowCheckin(() => {
							this.v.checkinWin.placeCombo.initValues({
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
				
			var cr = new CheckinReact();

			fc.forEach((c) => {
				var context = CheckinMapping.map(c, CheckinType.Now);
					
				var $u = $(this.checkinTemplate(context));
				$u.find(".chat-btn").click((e) => {
						e.preventDefault();

					this.v.hasFullReg(() => {
							cr.askForChat(c.userId, c.id);
					});
						
				});
				$listCont.append($u);
			});				
		}

		}

	export class CheckinMapping {

			public static map(c, type: CheckinType) {

					var d = new Date();
					var curYear = d.getFullYear();

					var context = {
							uid: c.userId,
							cid: c.id,
							name: c.displayName,
							age: curYear - c.birthYear,
							languages: c.languages,

							fromAge: c.fromAge,
							toAge: c.toAge,

							homeCountry: c.homeCountry,
							livesCountry: c.livesCountry,
							livesOtherCountry: c.homeCountry !== c.livesCountry,

							wmMan: ((c.wantMeet === WantMeet.Man) || (c.wantMeet === WantMeet.All)),
							wmWoman: ((c.wantMeet === WantMeet.Woman) || (c.wantMeet === WantMeet.All)),
							wmWomanGroup: ((c.wantMeet === WantMeet.Woman) && c.multiPeopleAllowed),
							wmManGroup: ((c.wantMeet === WantMeet.Man) && c.multiPeopleAllowed),
							wmMixGroup: ((c.wantMeet === WantMeet.All) && c.multiPeopleAllowed),

							wantDos: Views.StrOpers.getActivityStrArray(c.wantDo),
							message: c.message,

							isYou: (c.userId === Views.ViewBase.currentUserId),

							waitingAtId: c.waitingAtId,
							waitingAtType: c.waitingAtType,
							waitingAtText: c.waitingAtText,
							waitingCoord: c.waitingCoord,
							waitingLink: Common.GlobalUtils.getSocLink(c.waitingAtType, c.waitingAtId)
					};


					if (type === CheckinType.Now) {
							context = $.extend(context, {
									waitingStr: TravelBUtils.minsToTimeStr(TravelBUtils.waitingMins(c.waitingUntil))
							});
					}

					if (type === CheckinType.City) {
						context = $.extend(context, {
								fromDate: Views.StrOpers.formatDate(c.fromDate),
								toDate: Views.StrOpers.formatDate(c.toDate)
						});
					}



				return context;
			}

	}

	export class CheckinReact {
		public askForChat(uid, cid) {
			var data = { uid: uid, cid: cid };

			var v = Views.ViewBase.currentView;
				
			v.apiPost("CheckinReact", data, () => {
				var id = new Common.InfoDialog();
				id.create(v.t("RequestSentTitle", "jsTravelB"), v.t("RequestSentBody", "jsTravelB"));
			});

		}
	}
}