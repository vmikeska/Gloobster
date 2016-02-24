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
        }
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