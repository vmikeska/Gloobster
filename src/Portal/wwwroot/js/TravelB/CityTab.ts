module TravelB {
	export class CityTab {

		private checkinTemplate;
			private layoutTemplate;
			private checkinMgmtTemplate;
			private langsTagger;

			private layoutCreated = false;

		constructor() {
			this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinCityItem-template");
			this.layoutTemplate = Views.ViewBase.currentView.registerTemplate("cityListLayout-template");
			this.checkinMgmtTemplate = Views.ViewBase.currentView.registerTemplate("checkinCityMgmtItem-template");
		}
			
		private createLayout() {
			if (!this.layoutCreated) {
				var $cont = $("#theCont");
				$cont.html(this.layoutTemplate());
				this.layoutCreated = true;
			}
		}

		public genCheckinsList(checkins) {

			this.createLayout();

			var $listCont = $("#theCont .items");
			$listCont.html("");

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
					waitingFor: Views.StrOpers.getGenderStr(p.wantMeet),
					wants: Views.StrOpers.getActivityStr(p.wantDo),
					fromDate: DateUtils.myDateToStr(p.fromDate),
					toDate: DateUtils.myDateToStr(p.toDate)
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