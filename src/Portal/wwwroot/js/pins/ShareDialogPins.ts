module Views {
		export class ShareDialogPins {

				private shareButtons: Common.ShareButtons;
				private $html;

				constructor() {

						var v = ViewBase.currentView;

						var t = v.registerTemplate("pins-share-template");
						this.$html = $(t());
						
						var cd = new Common.CustomDialog();
						cd.init(this.$html, v.t("ShareTitle", "jsPins"), "share-dlg");
						
						this.shareButtons = new Common.ShareButtons($(".share-cont"));

						this.shareButtons.onSelectionChanged = (nets) => {
								this.fillSocStr(nets);
						}

						cd.addBtn(v.t("ShareBtn", "jsPins"), "green-orange", () => {
								cd.close();

								this.share(() => {
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
								message: this.$html.find("textarea").val(),
								networks: networks
						};

						ViewBase.currentView.apiPost("PinBoardShare", data, response => {
								callback();
						});
				}

		}

}