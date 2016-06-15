module Views {
	export class SettingsView extends ViewBase {

			private langsTagger;
			private interestsTagger;

		constructor() {
			super();
			this.registerAvatarFileUpload();
			this.registerLocationCombo("homeCity", "HomeLocation");
			this.registerLocationCombo("currentCity", "CurrentLocation");

			this.registerCombos();
			this.fillYearCombo();

			this.registerEdit("displayName", "DisplayName", (value) => {
				return { name: value };
			});

			this.registerEdit("firstName", "FirstName", (value) => {
				return { name: value };
			});

			this.registerEdit("lastName", "LastName", (value) => {
				return { name: value };
			});

			this.registerEdit("shortDescription", "ShortDescription", (value) => {
					return { text: value };
			});


			


			this.initPairing();


		}

		private registerEdit(id, prop, valsCallback) {
			var displayNameCall = new Common.DelayedCallback(id);
			displayNameCall.callback = (value) => {
				var vals = valsCallback(value);
				this.callServer(prop, vals);
			}
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

			private callServer(prop, values, callback = null) {
					var data = { propertyName: prop, values: values };
					this.apiPut("UserProperty", data, () => {
						callback();
					});
			}
			
		private registerCombos() {

				this.registerCombo("birthYear", (val) => {
						return { propertyName: "BirthYear", values: { year: val } };
				});
				
			this.registerCombo("gender", (val) => {
				return { propertyName: "Gender", values: { gender: val } };
				});

			this.registerCombo("familyStatus", (val) => {
					return { propertyName: "FamilyStatus", values: { status: val } };
			});
				
			this.fillYearCombo();

		}

		private fillYearCombo() {
				var $ul = $("#birthYear").find("ul");;
					var yearStart = 1940;
					var yearEnd = yearStart + 80;
					for (var act = yearStart; act <= yearEnd; act++) {
							$ul.append(`<li data-value="${act}">${act}</li>`);
					}
			}

		private registerCombo(id, dataBuild) {
			var $root = $(`#${id}`);
			var $val = $root.find("input");

			$val.change(e => {
				var val = $val.val();
				var data = dataBuild(val);					
				this.apiPut("UserProperty", data, () => {
					//alert("updated");
				});
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

		

		private registerLocationCombo(elementId: string, propertyName: string) {
			var homeConf = this.getLocationBaseConfig();
			homeConf.elementId = elementId;

			var box = new Common.PlaceSearchBox(homeConf);
			box.onPlaceSelected = (request) => {					
				this.callServer(propertyName, { sourceId: request.SourceId, sourceType: request.SourceType });				
			};
		}

		private getLocationBaseConfig() {
			var c = new Common.PlaceSearchConfig();
			c.providers = "2";
			c.minCharsToSearch = 2;
			c.clearAfterSearch = false;
			return c;
		}
			
		private initInterestsTagger(selectedItems) {
				var itemsRange = [
						{ text: "Traveling", value: 0, kind: "i" },
						{ text: "Partying", value: 1, kind: "i" },
						{ text: "Sport", value: 2, kind: "i" },
						{ text: "Drinking", value: 3, kind: "i" },
						{ text: "Eating", value: 4, kind: "i" }						
				];

				var config = new Planning.TaggingFieldConfig();
				config.containerId = "intersTagging";
				config.localValues = true;
				config.itemsRange = itemsRange;

				this.interestsTagger = new Planning.TaggingField(config);
				this.interestsTagger.onItemClickedCustom = ($target, callback) => {
						var val = $target.data("vl");
						this.callServer("Inters", { value: val, action: "ADD" }, callback);
				}

				this.interestsTagger.onDeleteCustom = (val, callback) => {
						this.callServer("Inters", { value: val, action: "DEL" }, callback);
				}

				//set init values		
				var selItms = _.map(selectedItems, (i) => {
						return { value: i, kind: "i" };
				});
				this.interestsTagger.setSelectedItems(selItms);
		}

			private initLangsTagger(selectedItems) {
					var itemsRange = [
							{ text: "English", value: "en", kind: "l"},
							{ text: "German", value: "de", kind: "l" },
							{ text: "Czech", value: "cz", kind: "l" },
							{ text: "Spanish", value: "es", kind: "l" },
							{ text: "Portuguese", value: "pt", kind: "l" },
							{ text: "French", value: "fr", kind: "l" }
					];
					
				var config = new Planning.TaggingFieldConfig();				
				config.containerId = "langsTagging";
				config.localValues = true;
				config.itemsRange = itemsRange;
					
				this.langsTagger = new Planning.TaggingField(config);
				this.langsTagger.onItemClickedCustom = ($target, callback) => {
						var val = $target.data("vl");					
						this.callServer("Langs", { value: val, action: "ADD" }, callback);						
				}

				this.langsTagger.onDeleteCustom = (val, callback) => {
						this.callServer("Langs", { value: val, action: "DEL" }, callback);
				}

				//set init values		
				var selItms = _.map(selectedItems, (i) => {
					return { value: i, kind: "l" };
				});
				this.langsTagger.setSelectedItems(selItms);
			}


		}
}