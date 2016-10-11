module TravelB {
	export class CityTab {

		private checkinTemplate;			
			private checkinMgmtTemplate;
			private langsTagger;

			private layoutCreated = false;

		constructor() {
			this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinCityItem-template");			
			this.checkinMgmtTemplate = Views.ViewBase.currentView.registerTemplate("checkinCityMgmtItem-template");
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

			var d = new Date();
			var curYear = d.getFullYear();
			
				var v = <Views.TravelBView>Views.ViewBase.currentView;
			var selFilter = v.filter.selectedFilter;

			checkins.forEach((p) => {
					
					var context = {
						cid: p.id,
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
						
						fromDate: DateUtils.myDateToStr(p.fromDate),
						toDate: DateUtils.myDateToStr(p.toDate),
						message: p.message
					};

				var tmp = _.contains(selFilter,"mine") ? this.checkinMgmtTemplate : this.checkinTemplate;

				var $u = $(tmp(context));

				$u.find(".del").click((e) => {
						e.preventDefault();

						var cd = new Common.ConfirmDialog();
						cd.create("Checkin deletion", "Do you really want to delete this checkin ?", "Cancel", "Delete", () => {
								var $t = $(e.target);
								var $c = $t.closest(".userItem");
								var cid = $c.data("cid");
								var prms = [["id", cid]];
								Views.ViewBase.currentView.apiDelete("CheckinCity", prms, (r) => {
									$c.remove();
								});	
						});						
				});

				$u.find(".sendMsg").click((e) => {
						e.preventDefault();
						var $t = $(e.target);
						var $c = $t.closest(".userItem");
						var userId = $c.data("uid");
						window.location.href = `/TravelB/Message/${userId}`;
				});

				$listCont.append($u);
			});
		}

	}
}