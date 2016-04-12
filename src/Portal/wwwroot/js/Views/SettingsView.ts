module Views {
	export class SettingsView extends ViewBase {

		constructor() {
			super();
			this.registerAvatarFileUpload();
			this.registerLocationCombo("homeCity", "HomeLocation");
			this.registerLocationCombo("currentCity", "CurrentLocation");
			this.registerGenderCombo();

			var displayNameCall = new Common.DelayedCallback("displayName");
			displayNameCall.callback = (value) => this.displayNameCallback(value);

			this.initPairing();
		}

		private btnExists(id) {
			return $(`#${id}`).length === 1;
		}

		private initPairing() {
			var fb = "fbBtnPair";
			if (this.btnExists(fb)) {
				var fbBtn = new Reg.FacebookButtonInit(fb);
				fbBtn.onBeforeExecute = () => this.onBefore(fb);
				fbBtn.onAfterExecute = () => this.onAfter();
			}

			var google = "googleBtnPair";
			if (this.btnExists(google)) {
				var googleBtn = new Reg.GoogleButtonInit(google);
				googleBtn.onBeforeExecute = () => this.onBefore(google);
				googleBtn.onAfterExecute = () => this.onAfter();
			}

			var twitter = "twitterBtnPair";
			if (this.btnExists(twitter)) {
				var twitterBtn = new Reg.TwitterButtonInit(twitter);
				twitterBtn.onBeforeExecute = () => this.onBefore(twitter);
				twitterBtn.onAfterExecute = () => this.onAfter();
			}
		}

		private onBefore(id) {
			$(`#${id}`).remove();
		}

		private onAfter() {
			var hint = new Common.HintDialog();
			hint.create("You are successfully paired!");
			$("#MenuRegister").parent().remove();
		}

		private displayNameCallback(value: string) {
			var data = { propertyName: "DisplayName", values: { name: value } };
			this.apiPut("UserProperty", data, () => {
				//alert("updated");
			});
		}

		private registerAvatarFileUpload() {
			var c = new Common.FileUploadConfig();
			c.inputId = "avatarFile";
			c.endpoint = "UploadAvatar";
			c.maxFileSize = 5500000;
			c.useMaxSizeValidation = false;

			var fileUpload = new Common.FileUpload(c);

			fileUpload.onProgressChanged = (percent) => {
				$("#progressBar").text(percent);
			}
			fileUpload.onUploadFinished = (file) => {
				var d = new Date();
				$("#avatar").attr("src", `/PortalUser/ProfilePicture?d=${d.getTime()}`);
			}
		}

		private registerGenderCombo() {
			var $root = $("#gender");
			var $val = $root.find("input");

			$val.change(e => {
				var gender = $val.val();

				var data = { propertyName: "Gender", values: { gender: gender } };
				this.apiPut("UserProperty", data, () => {
					//alert("updated");
				});

			});
		}

		private registerLocationCombo(elementId: string, propertyName: string) {
			var homeConf = this.getLocationBaseConfig();
			homeConf.elementId = elementId;

			var box = new Common.PlaceSearchBox(homeConf);
			box.onPlaceSelected = (request) => {
				var data = { propertyName: propertyName, values: { sourceId: request.SourceId, sourceType: request.SourceType } };
				this.apiPut("UserProperty", data, () => {
				});
			};
		}

		private getLocationBaseConfig() {
			var c = new Common.PlaceSearchConfig();
			c.providers = "2";
			c.minCharsToSearch = 2;
			c.clearAfterSearch = false;
			return c;
		}


	}
}