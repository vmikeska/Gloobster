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
            var _this = this;
            _super.call(this);
            this.registerAvatarFileUpload();
            this.registerLocationCombo("homeCity", "HomeLocation");
            this.registerLocationCombo("currentCity", "CurrentLocation");
            this.registerGenderCombo();
            var displayNameCall = new Common.DelayedCallback("displayName");
            displayNameCall.callback = function (value) { return _this.displayNameCallback(value); };
            this.initPairing();
        }
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
            hint.create("You are successfully connected!");
            $("#MenuRegister").parent().remove();
        };
        SettingsView.prototype.displayNameCallback = function (value) {
            var data = { propertyName: "DisplayName", values: { name: value } };
            this.apiPut("UserProperty", data, function () {
                //alert("updated");
            });
        };
        SettingsView.prototype.registerAvatarFileUpload = function () {
            var avatarUploadConfig = new Common.FileUploadConfig();
            avatarUploadConfig.inputId = "avatarFile";
            avatarUploadConfig.endpoint = "UploadAvatar";
            var fileUpload = new Common.FileUpload(avatarUploadConfig);
            fileUpload.onProgressChanged = function (percent) {
                $("#progressBar").text(percent);
            };
            fileUpload.onUploadFinished = function (file) {
                var d = new Date();
                $("#avatar").attr("src", "/PortalUser/ProfilePicture?d=" + d.getTime());
            };
        };
        SettingsView.prototype.registerGenderCombo = function () {
            var _this = this;
            var $root = $("#gender");
            var $val = $root.find("input");
            $val.change(function (e) {
                var gender = $val.val();
                var data = { propertyName: "Gender", values: { gender: gender } };
                _this.apiPut("UserProperty", data, function () {
                    //alert("updated");
                });
            });
        };
        SettingsView.prototype.registerLocationCombo = function (elementId, propertyName) {
            var _this = this;
            var homeConf = this.getLocationBaseConfig();
            homeConf.elementId = elementId;
            var box = new Common.PlaceSearchBox(homeConf);
            box.onPlaceSelected = function (request) {
                var data = { propertyName: propertyName, values: { sourceId: request.SourceId, sourceType: request.SourceType } };
                _this.apiPut("UserProperty", data, function () {
                });
            };
        };
        SettingsView.prototype.getLocationBaseConfig = function () {
            var c = new Common.PlaceSearchConfig();
            c.providers = "2";
            c.minCharsToSearch = 2;
            c.clearAfterSearch = false;
            return c;
        };
        return SettingsView;
    })(Views.ViewBase);
    Views.SettingsView = SettingsView;
})(Views || (Views = {}));
//# sourceMappingURL=SettingsView.js.map