module Views {
	export class SettingsView extends ViewBase {

		private langs;
		private inters;

		public init() {			
			SettingsUtils.registerAvatarFileUpload("avatarFile");
			SettingsUtils.registerLocationCombo("homeCity", "HomeLocation");
			SettingsUtils.registerLocationCombo("currentCity", "CurrentLocation");
				
			SettingsUtils.registerEdit("displayName", "DisplayName", (value) => {
				return { name: value };
			});

			SettingsUtils.registerEdit("firstName", "FirstName", (value) => {
				return { name: value };
			});

			SettingsUtils.registerEdit("lastName", "LastName", (value) => {
				return { name: value };
			});

			SettingsUtils.registerEdit("birthYear", "BirthYear", (value) => {
					return { year: value };
			});

			SettingsUtils.registerEdit("shortDescription", "ShortDescription", (value) => {
				return { text: value };
			});

			SettingsUtils.registerCombo("gender", (val) => {
					return { propertyName: "Gender", values: { gender: val } };
			});

			SettingsUtils.registerCombo("familyStatus", (val) => {
					return { propertyName: "FamilyStatus", values: { status: val } };
			});
				
			SettingsUtils.initInterestsTagger(this.inters);
			SettingsUtils.initLangsTagger(this.langs);

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
			hint.create(this.t("SuccessfulPaired", "jsLayout"));
			$("#MenuRegister").parent().remove();
		}
			
	}
}