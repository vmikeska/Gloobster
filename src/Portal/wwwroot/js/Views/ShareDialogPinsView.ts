module Views {
	export class ShareDialogPinsView {

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
				networks: networks				
			}

			ViewBase.currentView.apiPost("PinBoardShare", data, response => {
				this.$dialog.hide();
			});
		}

	}

}