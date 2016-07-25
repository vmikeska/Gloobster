module Views {
	export class RequestToJoinView extends ViewBase {
			
		constructor() {
				super();

				var dlg = new Common.InfoDialog();

				$("#reqBtn").click((e) => {
						e.preventDefault();

						var $t = $(e.target);

						var data = { tid: $t.data("tid") };
						
						this.apiPost("RequestTripInvitation", data, (r) => {							
								dlg.create(this.t("ConfirmTitle", "jsTripJoin"), this.t("ConfirmBody", "jsTripJoin"));
						});
				});
		}

	}
}