module Views {
	export class SettingsView extends Views.ViewBase {

		constructor() {
			super();
			this.registerAvatarFileUpload();
			this.registerLocationCombo("homeCity", "HomeLocation");
			this.registerLocationCombo("currentCity", "CurrentLocation");
			this.registerGenderCombo();

			var displayNameCall = new Common.DelayedCallback("displayName");
			displayNameCall.callback = (value) => this.displayNameCallback(value);
		}

		private displayNameCallback(value: string) {
			var data = { propertyName: "DisplayName", values: { name: value } };
			this.apiPut("UserProperty", data, () => {
				//alert("updated");
			});
		}

		private registerAvatarFileUpload() {
		 var avatarUploadConfig = new Common.FileUploadConfig();
			avatarUploadConfig.inputId = "avatarFile";
			avatarUploadConfig.endpoint = "UploadAvatar";

			var fileUpload = new Common.FileUpload(avatarUploadConfig);

			fileUpload.onProgressChanged = (percent) => {
				$("#progressBar").text(percent);
			}
			fileUpload.onUploadFinished = (file) => {

				var fileReader = new FileReader();
				fileReader.onload = evnt => {
					var base64Img = evnt.target["result"];
					$("#avatar").attr("src", base64Img);
				};

				fileReader.readAsDataURL(file);
			}
		}

		private registerGenderCombo() {
			var $root = $("#gender");

			$root.find("li").click(evnt => {
				var gender = $(evnt.target).data("value");

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