var Views;
(function (Views) {
    var SettingsUtils = (function () {
        function SettingsUtils() {
        }
        SettingsUtils.yearValidation = function (val) {
            if (val.length !== 4) {
                return false;
            }
            if (Common.F.tryParseInt(val) === null) {
                return false;
            }
            return true;
        };
        SettingsUtils.registerAvatarFileUpload = function (id, callback) {
            if (callback === void 0) { callback = null; }
            var c = new Common.FileUploadConfig();
            c.inputId = id;
            c.endpoint = "UploadAvatar";
            c.maxFileSize = 5500000;
            c.useMaxSizeValidation = false;
            var fileUpload = new Common.FileUpload(c);
            fileUpload.onProgressChanged = function (percent) {
                $("#progressBar").text(percent);
            };
            fileUpload.onUploadFinished = function (file) {
                var d = new Date();
                $("#avatar").attr("src", "/PortalUser/ProfilePicture?d=" + d.getTime());
                $("#" + id).data("valid", true);
                if (callback) {
                    callback();
                }
            };
        };
        SettingsUtils.registerEdit = function (id, prop, valsCallback, finishedCallback) {
            var _this = this;
            if (finishedCallback === void 0) { finishedCallback = null; }
            var $i = $("#" + id);
            var dc = new Common.DelayedCallback(id);
            dc.callback = function (value) {
                if ($i.attr("type") === "number") {
                    value = Common.F.tryParseInt(value);
                }
                var vals = valsCallback(value);
                _this.callServer(prop, vals, finishedCallback);
            };
        };
        SettingsUtils.registerCombo = function (id, dataBuild) {
            var $root = $("#" + id);
            var $val = $root.find("input");
            $val.change(function (e) {
                var val = $val.val();
                var data = dataBuild(val);
                Views.ViewBase.currentView.apiPut("UserProperty", data, function () {
                });
            });
        };
        SettingsUtils.callServer = function (prop, values, callback) {
            if (callback === void 0) { callback = null; }
            var data = { propertyName: prop, values: values };
            Views.ViewBase.currentView.apiPut("UserProperty", data, function () {
                if (callback) {
                    callback();
                }
            });
        };
        SettingsUtils.registerLocationCombo = function ($combo, propertyName, callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            var homeConf = this.getLocationBaseConfig();
            homeConf.selOjb = $combo;
            var box = new Common.PlaceSearchBox(homeConf);
            $combo.change(function (e, request) {
                _this.callServer(propertyName, { sourceId: request.SourceId, sourceType: request.SourceType }, callback);
            });
            return box;
        };
        SettingsUtils.initInterests = function ($c, inters) {
            var interests = new TravelB.CategoryTagger();
            interests.onFilterChange = (function (addedOrDeleted, id) {
                var action = addedOrDeleted ? "ADD" : "DEL";
                SettingsUtils.callServer("Inters", { value: id, action: action }, function () { });
            });
            var data = TravelB.TravelBUtils.getInterestsTaggerData();
            var v = Views.ViewBase.currentView;
            interests.create($c, "inters", data, v.t("PickCharacteristics", "jsUserSettings"));
            interests.initData(inters);
        };
        SettingsUtils.initLangsTagger = function (selectedItems, placeholder) {
            var _this = this;
            if (placeholder === void 0) { placeholder = null; }
            var langs = TravelB.TravelBUtils.langsDB();
            var itemsRange = _.map(langs, function (i) {
                return { text: i.text, value: i.id, kind: "l" };
            });
            var config = new Planning.TaggingFieldConfig();
            config.containerId = "langsTagging";
            config.localValues = true;
            config.itemsRange = itemsRange;
            if (placeholder) {
                config.placeholder = placeholder;
            }
            var t = new Planning.TaggingField(config);
            t.onItemClickedCustom = function ($target, callback) {
                var val = $target.data("vl");
                _this.callServer("Langs", { value: val, action: "ADD" }, callback);
            };
            t.onDeleteCustom = function (val, callback) {
                _this.callServer("Langs", { value: val, action: "DEL" }, callback);
            };
            var selItms = _.map(selectedItems, function (i) {
                return { value: i, kind: "l" };
            });
            t.setSelectedItems(selItms);
            return t;
        };
        SettingsUtils.getLocationBaseConfig = function () {
            var c = new Common.PlaceSearchConfig();
            c.providers = "2";
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            return c;
        };
        return SettingsUtils;
    }());
    Views.SettingsUtils = SettingsUtils;
})(Views || (Views = {}));
//# sourceMappingURL=SettingsUtils.js.map