module TravelB {
	export class CityTab {

		private checkinTemplate;

		constructor() {
			this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinCityItem-template");
		}

		public genCheckinsList(checkins) {

			var $listCont = $("#theCont");
			$listCont.html("");

			var d = new Date();
			var curYear = d.getFullYear();

			checkins.forEach((p) => {

				var context = {
					id: p.userId,
					name: p.displayName,
					age: curYear - p.birthYear,
					waitingFor: Views.StrOpers.getGenderStr(p.wantMeet),
					wants: Views.StrOpers.getActivityStr(p.wantDo),
					fromDate: DateUtils.myDateToStr(p.fromDate),
					toDate: DateUtils.myDateToStr(p.toDate)
				};

				var $u = $(this.checkinTemplate(context));
				$listCont.append($u);
			});
		}

	}
}