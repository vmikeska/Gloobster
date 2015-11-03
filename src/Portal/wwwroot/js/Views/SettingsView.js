var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SettingsView = (function (_super) {
    __extends(SettingsView, _super);
    function SettingsView() {
        var _this = this;
        _super.call(this);
        this.registerAvatarFileUpload();
        this.registerLocationCombo("homeCity", "HomeLocation");
        this.registerLocationCombo("currentCity", "CurrentLocation");
        this.registerGenderCombo();
        var displayNameCall = new DelayedCallback("displayName");
        displayNameCall.callback = function (value) { return _this.displayNameCallback(value); };
    }
    SettingsView.prototype.displayNameCallback = function (value) {
        var data = { propertyName: "DisplayName", values: { name: value } };
        this.apiPut("UserProperty", data, function () {
            //alert("updated");
        });
    };
    SettingsView.prototype.registerAvatarFileUpload = function () {
        var avatarUploadConfig = new FileUploadConfig();
        avatarUploadConfig.inputId = "avatarFile";
        avatarUploadConfig.owner = this;
        avatarUploadConfig.endpoint = "UploadAvatar";
        var fileUpload = new FileUpload(avatarUploadConfig);
        fileUpload.onProgressChanged = function (percent) {
            $("#progressBar").text(percent);
        };
        fileUpload.onUploadFinished = function (file) {
            var fileReader = new FileReader();
            fileReader.onload = function (evnt) {
                var base64Img = evnt.target["result"];
                $("#avatar").attr("src", base64Img);
            };
            fileReader.readAsDataURL(file);
        };
    };
    SettingsView.prototype.registerGenderCombo = function () {
        var _this = this;
        var $root = $("#gender");
        $root.find("li").click(function (evnt) {
            var gender = $(evnt.target).data("value");
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
        var box = new PlaceSearchBox(homeConf);
        box.onPlaceSelected = function (request) {
            var data = { propertyName: propertyName, values: { sourceId: request.SourceId, sourceType: request.SourceType } };
            _this.apiPut("UserProperty", data, function () {
                //alert("updated");
            });
        };
    };
    SettingsView.prototype.getLocationBaseConfig = function () {
        var c = new PlaceSearchConfig();
        c.owner = this;
        c.providers = "2";
        c.minCharsToSearch = 2;
        c.clearAfterSearch = false;
        return c;
    };
    return SettingsView;
})(Views.ViewBase);
//# sourceMappingURL=SettingsView.js.map