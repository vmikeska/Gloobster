module Views {
	export class ShareDialogView {

		private shareButtons: Common.ShareButtons;
		private $dialog: any;

		constructor() {
			this.$dialog = $("#popup-share");
			this.shareButtons = new Common.ShareButtons($("#shareCont"), "Share on social media");
			$("#share").click(() => this.share());
		}

		private share() {
			var networks = this.shareButtons.getSelectedNetworks();

			var data = {
				message: $("#message").val(),
				tripId: ViewBase.currentView["trip"].tripId,
				networks: networks,
				allowRequestJoin: $("#allowRequestJoin").prop("checked")
			}
		 
			ViewBase.currentView.apiPost("TripSocNetworks", data, response => {
				this.$dialog.hide();
			});
		}

	}

}