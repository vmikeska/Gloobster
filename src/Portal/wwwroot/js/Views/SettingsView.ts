module Views {
	export class SettingsView extends ViewBase {

			public langs;			
			public inters;

			private interests;

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
				
			this.initInterests();
			//SettingsUtils.initInterestsTagger(this.inters);
				
			SettingsUtils.initLangsTagger(this.langs);

			this.initPairing();

			this.initPairedMenu();
		}

		private activeSocItem = null;

		private initPairedMenu() {
			$(".soc-ico").click((e) => {
				e.preventDefault();

				var $t = $(e.target);
				this.activeSocItem = parseInt($t.data("t"));

				$(".menu").toggle();					
			});

			$(".menu .unpair").click((e) => {
					e.preventDefault();
					
					this.callUnpair();
			});


			$(".menu .close").click((e) => {
					e.preventDefault();

					$(".menu").toggle();
			});
		}

		private callUnpair() {

				var name = "";
				if (this.activeSocItem === SocialNetworkType.Facebook) {
					name = "Facebook";
				}

				if (this.activeSocItem === SocialNetworkType.Twitter) {
						name = "Twitter";
				}

				if (this.activeSocItem === SocialNetworkType.Google) {
						name = "Google";
				}

				var cd = new Common.ConfirmDialog();

				cd.create("Unpairing confirmation", `Would you like to unpair with ${name}?`, "Cancel", "Unpair", () => {

						var ep = `${name}User`;
						this.apiDelete(ep, [], (r) => {
								$(`.soc-ico[data-t="${this.activeSocItem}"]`).hide();
								$(".menu").toggle();

								$(`.logins-to-pair .item[data-t="${this.activeSocItem}"]`).show();
						});	
				});

				
		}


		private initInterests() {
				var $c = $("#intersTagging");

				this.interests = new TravelB.CategoryTagger();
				this.interests.onFilterChange = ((addedOrDeleted, id) => {
					var action = addedOrDeleted ? "ADD" : "DEL";
					SettingsUtils.callServer("Inters", { value: id, action: action }, () => { });					
				});

				var data = TravelB.TravelBUtils.getInterestsTaggerData();				
				this.interests.create($c, "inters", data);				

				this.interests.initData(this.inters);
		}
			
		private btnExists(id) {
			return $(`#${id}`).length === 1;
		}

		private initPairing() {
			var fb = "fbBtnPair";
			if (this.btnExists(fb)) {
				var fbBtn = new Reg.FacebookButtonInit(fb);
				fbBtn.onBeforeExecute = () => this.onBefore(fb);
				fbBtn.onAfterExecute = () => this.onAfter(fb);
			}

			var google = "googleBtnPair";
			if (this.btnExists(google)) {
				var googleBtn = new Reg.GoogleButtonInit(google);
				googleBtn.onBeforeExecute = () => this.onBefore(google);
				googleBtn.onAfterExecute = () => this.onAfter(google);
			}

			var twitter = "twitterBtnPair";
			if (this.btnExists(twitter)) {
				var twitterBtn = new Reg.TwitterButtonInit(twitter);
				twitterBtn.onBeforeExecute = () => this.onBefore(twitter);
				twitterBtn.onAfterExecute = () => this.onAfter(twitter);
			}
		}

		private onBefore(id) {							
			$(`#${id}`).parent().hide();
		}

		private onAfter(id) {
			
			var sid = null;
			if (id === "fbBtnPair") {
				sid = 0;
			} else if (id === "googleBtnPair") {
				sid = 1;
			} else if (id === "twitterBtnPair") {
				sid = 2;
			}

			$(`.soc-ico[data-t="${sid}"]`).show();
		}

	}
}