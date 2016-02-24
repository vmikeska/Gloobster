module Views {
	export class NotificationsView extends ViewBase {

		constructor() {
			super();
			this.registerDelButtons();
			this.registerDelAllButton();
		}

		private registerDelButtons() {
			$(".notif_delete").click((e) => {
				e.preventDefault();
				var $btn = $(e.delegateTarget);
				var notifId = $btn.data("notifid");
				var prms = [["id", notifId]];
				this.apiDelete("notification", prms, (r) => {
					var $notif = $("#" + notifId);
					$notif.remove();
					this.setForm(parseInt(r));
				});
			});
		}

		private registerDelAllButton() {
			$("#deleteAll").click((e) => {
				e.preventDefault();
				var prms = [["deleteAll", "true"]];
				this.apiDelete("notification", prms, (r) => {
					var $notif = $(".notif_item");
					$notif.remove();
					this.setForm(parseInt(r));
				});
			});
		}

		private setForm(notifCnt) {
			if (notifCnt === 0) {
				$("#noNotifs").show();
				$("#deleteAll").hide();
			}
		}
	}
}