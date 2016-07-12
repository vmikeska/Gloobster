var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var SettingsView = (function (_super) {
        __extends(SettingsView, _super);
        function SettingsView() {
            _super.call(this);
            this.registerAvatarFileUpload();
            this.registerLocationCombo("homeCity", "HomeLocation");
            this.registerLocationCombo("currentCity", "CurrentLocation");
            this.registerCombos();
            this.fillYearCombo();
            this.registerEdit("displayName", "DisplayName", function (value) {
                return { name: value };
            });
            this.registerEdit("firstName", "FirstName", function (value) {
                return { name: value };
            });
            this.registerEdit("lastName", "LastName", function (value) {
                return { name: value };
            });
            this.registerEdit("shortDescription", "ShortDescription", function (value) {
                return { text: value };
            });
            this.initPairing();
        }
        SettingsView.prototype.registerEdit = function (id, prop, valsCallback) {
            var _this = this;
            var displayNameCall = new Common.DelayedCallback(id);
            displayNameCall.callback = function (value) {
                var vals = valsCallback(value);
                _this.callServer(prop, vals);
            };
        };
        SettingsView.prototype.btnExists = function (id) {
            return $("#" + id).length === 1;
        };
        SettingsView.prototype.initPairing = function () {
            var _this = this;
            var fb = "fbBtnPair";
            if (this.btnExists(fb)) {
                var fbBtn = new Reg.FacebookButtonInit(fb);
                fbBtn.onBeforeExecute = function () { return _this.onBefore(fb); };
                fbBtn.onAfterExecute = function () { return _this.onAfter(); };
            }
            var google = "googleBtnPair";
            if (this.btnExists(google)) {
                var googleBtn = new Reg.GoogleButtonInit(google);
                googleBtn.onBeforeExecute = function () { return _this.onBefore(google); };
                googleBtn.onAfterExecute = function () { return _this.onAfter(); };
            }
            var twitter = "twitterBtnPair";
            if (this.btnExists(twitter)) {
                var twitterBtn = new Reg.TwitterButtonInit(twitter);
                twitterBtn.onBeforeExecute = function () { return _this.onBefore(twitter); };
                twitterBtn.onAfterExecute = function () { return _this.onAfter(); };
            }
        };
        SettingsView.prototype.onBefore = function (id) {
            $("#" + id).remove();
        };
        SettingsView.prototype.onAfter = function () {
            var hint = new Common.HintDialog();
            hint.create(this.t("SuccessfulPaired", "jsLayout"));
            $("#MenuRegister").parent().remove();
        };
        SettingsView.prototype.callServer = function (prop, values, callback) {
            if (callback === void 0) { callback = null; }
            var data = { propertyName: prop, values: values };
            this.apiPut("UserProperty", data, function () {
                callback();
            });
        };
        SettingsView.prototype.registerCombos = function () {
            this.registerCombo("birthYear", function (val) {
                return { propertyName: "BirthYear", values: { year: val } };
            });
            this.registerCombo("gender", function (val) {
                return { propertyName: "Gender", values: { gender: val } };
            });
            this.registerCombo("familyStatus", function (val) {
                return { propertyName: "FamilyStatus", values: { status: val } };
            });
            this.fillYearCombo();
        };
        SettingsView.prototype.fillYearCombo = function () {
            var $ul = $("#birthYear").find("ul");
            ;
            var yearStart = 1940;
            var yearEnd = yearStart + 80;
            for (var act = yearStart; act <= yearEnd; act++) {
                $ul.append("<li data-value=\"" + act + "\">" + act + "</li>");
            }
        };
        SettingsView.prototype.registerCombo = function (id, dataBuild) {
            var _this = this;
            var $root = $("#" + id);
            var $val = $root.find("input");
            $val.change(function (e) {
                var val = $val.val();
                var data = dataBuild(val);
                _this.apiPut("UserProperty", data, function () {
                });
            });
        };
        SettingsView.prototype.registerAvatarFileUpload = function () {
            var c = new Common.FileUploadConfig();
            c.inputId = "avatarFile";
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
            };
        };
        SettingsView.prototype.registerLocationCombo = function (elementId, propertyName) {
            var _this = this;
            var homeConf = this.getLocationBaseConfig();
            homeConf.elementId = elementId;
            var box = new Common.PlaceSearchBox(homeConf);
            box.onPlaceSelected = function (request) {
                _this.callServer(propertyName, { sourceId: request.SourceId, sourceType: request.SourceType });
            };
        };
        SettingsView.prototype.getLocationBaseConfig = function () {
            var c = new Common.PlaceSearchConfig();
            c.providers = "2";
            c.minCharsToSearch = 2;
            c.clearAfterSearch = false;
            return c;
        };
        SettingsView.prototype.initInterestsTagger = function (selectedItems) {
            var _this = this;
            var interests = TravelB.TravelBUtils.interestsDB();
            var itemsRange = _.map(interests, function (i) {
                return { text: i.text, value: i.id, kind: "i" };
            });
            var config = new Planning.TaggingFieldConfig();
            config.containerId = "intersTagging";
            config.localValues = true;
            config.itemsRange = itemsRange;
            this.interestsTagger = new Planning.TaggingField(config);
            this.interestsTagger.onItemClickedCustom = function ($target, callback) {
                var val = $target.data("vl");
                _this.callServer("Inters", { value: val, action: "ADD" }, callback);
            };
            this.interestsTagger.onDeleteCustom = function (val, callback) {
                _this.callServer("Inters", { value: val, action: "DEL" }, callback);
            };
            var selItms = _.map(selectedItems, function (i) {
                return { value: i, kind: "i" };
            });
            this.interestsTagger.setSelectedItems(selItms);
        };
        SettingsView.prototype.initLangsTagger = function (selectedItems) {
            var _this = this;
            var langs = TravelB.TravelBUtils.langsDB();
            var itemsRange = _.map(langs, function (i) {
                return { text: i.text, value: i.id, kind: "l" };
            });
            var config = new Planning.TaggingFieldConfig();
            config.containerId = "langsTagging";
            config.localValues = true;
            config.itemsRange = itemsRange;
            this.langsTagger = new Planning.TaggingField(config);
            this.langsTagger.onItemClickedCustom = function ($target, callback) {
                var val = $target.data("vl");
                _this.callServer("Langs", { value: val, action: "ADD" }, callback);
            };
            this.langsTagger.onDeleteCustom = function (val, callback) {
                _this.callServer("Langs", { value: val, action: "DEL" }, callback);
            };
            var selItms = _.map(selectedItems, function (i) {
                return { value: i, kind: "l" };
            });
            this.langsTagger.setSelectedItems(selItms);
        };
        return SettingsView;
    }(Views.ViewBase));
    Views.SettingsView = SettingsView;
})(Views || (Views = {}));
//# sourceMappingURL=SettingsView.js.map