module Views {
	export class ShareDialogPinsView {

		private shareButtons: Common.ShareButtons;
		private $dialog: any;

		constructor() {
			this.$dialog = $("#popup-share");
			this.shareButtons = new Common.ShareButtons($("#shareCont"));
		  this.shareButtons.onSelectionChanged = (nets) => {
			  this.fillSocStr(nets);
		  }

			var v = ViewBase.currentView;

			$("#share").click(() => {

			 var id = new Common.InprogressDialog();
			 this.$dialog.hide();
			 id.create(v.t("SharingMap", "jsPins"));

			 this.share(() => {
				id.remove();
				var hd = new Common.HintDialog();
				hd.create(v.t("MapShared", "jsPins"));
			 });
			});

			this.fillSocStr(this.shareButtons.getStr());
		}

	 private fillSocStr(str) {
		$("#share").find("span").html(str);
	 }

		private share(callback) {
			var networks = this.shareButtons.getSelectedNetworks();

			var data = {
				message: $("#message").val(),				
				networks: networks				
			}

			ViewBase.currentView.apiPost("PinBoardShare", data, response => {
				callback();
			});
		}

	}

}