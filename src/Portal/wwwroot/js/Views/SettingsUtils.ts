module Views {
	export class SettingsUtils {

		public static registerAvatarFileUpload(id, callback = null) {
			var c = new Common.FileUploadConfig();
			c.inputId = id;
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
				if (callback) {
					callback();
				}
			}
		}

		public static registerEdit(id, prop, valsCallback, finishedCallback = null) {
			var displayNameCall = new Common.DelayedCallback(id);
			displayNameCall.callback = (value) => {
				var vals = valsCallback(value);
				this.callServer(prop, vals, finishedCallback);
			}
			}

		public static registerCombo(id, dataBuild) {
				var $root = $(`#${id}`);
				var $val = $root.find("input");

				$val.change(e => {
						var val = $val.val();
						var data = dataBuild(val);
						Views.ViewBase.currentView.apiPut("UserProperty", data, () => {
								//alert("updated");
						});
				});
		}

		public static callServer(prop, values, callback = null) {
			var data = { propertyName: prop, values: values };
			Views.ViewBase.currentView.apiPut("UserProperty", data, () => {
				if (callback) {
					callback();
				}
			});
		}

		public static registerLocationCombo(elementId: string, propertyName: string, callback = null) {
			var homeConf = this.getLocationBaseConfig();
			homeConf.elementId = elementId;

			var box = new Common.PlaceSearchBox(homeConf);
			box.onPlaceSelected = (request) => {
				this.callServer(propertyName, { sourceId: request.SourceId, sourceType: request.SourceType }, callback);
			};
		}

		//public static initInterestsTagger(selectedItems) {
					
		//	var interests = TravelB.TravelBUtils.interestsDB();

		//	var itemsRange = _.map(interests, (i) => {
		//		return { text: i.text, value: i.id, kind: "i" }
		//	});

		//	var config = new Planning.TaggingFieldConfig();
		//	config.containerId = "intersTagging";
		//	config.localValues = true;
		//	config.itemsRange = itemsRange;

		//	var t = new Planning.TaggingField(config);
		//	t.onItemClickedCustom = ($target, callback) => {
		//		var val = $target.data("vl");
		//		this.callServer("Inters", { value: val, action: "ADD" }, callback);
		//	}

		//	t.onDeleteCustom = (val, callback) => {
		//		this.callServer("Inters", { value: val, action: "DEL" }, callback);
		//	}

		//	//set init values		
		//	var selItms = _.map(selectedItems, (i) => {
		//		return { value: i, kind: "i" };
		//	});
		//	t.setSelectedItems(selItms);

		//	return t;
		//}

		public static initLangsTagger(selectedItems) {

			var langs = TravelB.TravelBUtils.langsDB();

			var itemsRange = _.map(langs, (i) => {
				return { text: i.text, value: i.id, kind: "l" }
			});

			var config = new Planning.TaggingFieldConfig();
			config.containerId = "langsTagging";
			config.localValues = true;
			config.itemsRange = itemsRange;

			var t = new Planning.TaggingField(config);
			t.onItemClickedCustom = ($target, callback) => {
				var val = $target.data("vl");
				this.callServer("Langs", { value: val, action: "ADD" }, callback);
			}

			t.onDeleteCustom = (val, callback) => {
				this.callServer("Langs", { value: val, action: "DEL" }, callback);
			}

			//set init values		
			var selItms = _.map(selectedItems, (i) => {
				return { value: i, kind: "l" };
			});
			t.setSelectedItems(selItms);

			return t;
		}

		private static getLocationBaseConfig() {
			var c = new Common.PlaceSearchConfig();
			c.providers = "2";
			c.minCharsToSearch = 2;
			c.clearAfterSearch = false;
			return c;
		}
	}
}