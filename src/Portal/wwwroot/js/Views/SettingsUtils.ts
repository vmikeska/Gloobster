module Views {
	export class SettingsUtils {

		public static yearValidation(val) {
			if (val.length !== 4) {
				return false;
			}

			if (Common.F.tryParseInt(val) === null) {
				return false;
			}

			return true;
		}

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
				$(`#${id}`).data("valid", true);
				if (callback) {
					callback();
				}
			}
		}

		public static registerEdit(id, prop, valsCallback, finishedCallback = null) {
			var $i = $(`#${id}`);

			var dc = new Common.DelayedCallback(id);
			dc.callback = (value) => {

					if ($i.attr("type") === "number") {
							value = Common.F.tryParseInt(value);													
					}

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
						ViewBase.currentView.apiPut("UserProperty", data, () => {
																
						});
				});
		}

		public static callServer(prop, values, callback = null) {
			var data = { propertyName: prop, values: values };
			ViewBase.currentView.apiPut("UserProperty", data, () => {
				if (callback) {
					callback();
				}
			});
		}

		public static registerLocationCombo($combo, propertyName: string, callback = null) {
			var homeConf = this.getLocationBaseConfig();
			homeConf.selOjb = $combo;

			var box = new Common.PlaceSearchBox(homeConf);
			$combo.change((e, request) => {
				this.callServer(propertyName, { sourceId: request.SourceId, sourceType: request.SourceType }, callback);
			});

			return box;
		}

		public static initInterests($c, inters) {
				
				var interests = new TravelB.CategoryTagger();
				interests.onFilterChange = ((addedOrDeleted, id) => {
						var action = addedOrDeleted ? "ADD" : "DEL";
						SettingsUtils.callServer("Inters", { value: id, action: action }, () => { });
				});

				var data = TravelB.TravelBUtils.getInterestsTaggerData();
				interests.create($c, "inters", data, "Pick some characteristics of you");

				interests.initData(inters);
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
			c.minCharsToSearch = 1;
			c.clearAfterSearch = false;
			return c;
		}
	}
}