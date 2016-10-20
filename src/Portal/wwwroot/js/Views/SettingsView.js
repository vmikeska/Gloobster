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
            _super.apply(this, arguments);
            this.activeSocItem = null;
        }
        SettingsView.prototype.init = function () {
            Views.SettingsUtils.registerAvatarFileUpload("avatarFile");
            this.homeCity = Views.SettingsUtils.registerLocationCombo($("#homeCity"), "HomeLocation");
            this.currentCity = Views.SettingsUtils.registerLocationCombo($("#currentCity"), "CurrentLocation");
            this.homeCity.setText(this.homeLocation);
            this.currentCity.setText(this.currentLocation);
            Views.SettingsUtils.registerEdit("displayName", "DisplayName", function (value) {
                return { name: value };
            });
            Views.SettingsUtils.registerEdit("firstName", "FirstName", function (value) {
                return { name: value };
            });
            Views.SettingsUtils.registerEdit("lastName", "LastName", function (value) {
                return { name: value };
            });
            Views.SettingsUtils.registerEdit("birthYear", "BirthYear", function (value) {
                return { year: value };
            });
            Views.SettingsUtils.registerEdit("shortDescription", "ShortDescription", function (value) {
                return { text: value };
            });
            Views.SettingsUtils.registerCombo("gender", function (val) {
                return { propertyName: "Gender", values: { gender: val } };
            });
            Views.SettingsUtils.registerCombo("familyStatus", function (val) {
                return { propertyName: "FamilyStatus", values: { status: val } };
            });
            Views.SettingsUtils.initInterests($("#intersTagging"), this.inters);
            this.langsTagger = Views.SettingsUtils.initLangsTagger(this.langs);
            this.initPairing();
            this.initPairedMenu();
            this.createTbVals();
        };
        SettingsView.prototype.initPairedMenu = function () {
            var _this = this;
            $(".soc-ico").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                _this.activeSocItem = parseInt($t.data("t"));
                $(".menu").toggle();
            });
            $(".menu .unpair").click(function (e) {
                e.preventDefault();
                _this.callUnpair();
            });
            $(".menu .close").click(function (e) {
                e.preventDefault();
                $(".menu").toggle();
            });
        };
        SettingsView.prototype.callUnpair = function () {
            var _this = this;
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
            cd.create("Unpairing confirmation", "Would you like to unpair with " + name + "?", "Cancel", "Unpair", function () {
                var ep = name + "User";
                _this.apiDelete(ep, [], function (r) {
                    $(".soc-ico[data-t=\"" + _this.activeSocItem + "\"]").hide();
                    $(".menu").toggle();
                    $(".logins-to-pair .item[data-t=\"" + _this.activeSocItem + "\"]").show();
                });
            });
        };
        SettingsView.prototype.createTbVals = function () {
            this.tbValids = new TravelB.FormValidations();
            this.tbValids.valMessage($("#firstName"), $("#firstName"));
            this.tbValids.valMessage($("#lastName"), $("#lastName"));
            this.tbValids.valMessage($("#birthYear"), $("#birthYear"), Views.SettingsUtils.yearValidation);
            this.tbValids.valPlace(this.homeCity, $("#homeCity"), $("#homeCity input"));
            this.tbValids.valPlace(this.currentCity, $("#currentCity"), $("#currentCity input"));
            this.tbValids.valTagger(this.langsTagger, $("#langsTagging input"));
            this.tbValids.valDropDownVal($("#gender"), $("#gender .selected"), Gender.N);
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
                fbBtn.onAfterExecute = function () { return _this.onAfter(fb); };
            }
            var google = "googleBtnPair";
            if (this.btnExists(google)) {
                var googleBtn = new Reg.GoogleButtonInit(google);
                googleBtn.onBeforeExecute = function () { return _this.onBefore(google); };
                googleBtn.onAfterExecute = function () { return _this.onAfter(google); };
            }
            var twitter = "twitterBtnPair";
            if (this.btnExists(twitter)) {
                var twitterBtn = new Reg.TwitterButtonInit(twitter);
                twitterBtn.onBeforeExecute = function () { return _this.onBefore(twitter); };
                twitterBtn.onAfterExecute = function () { return _this.onAfter(twitter); };
            }
        };
        SettingsView.prototype.onBefore = function (id) {
            $("#" + id).parent().hide();
        };
        SettingsView.prototype.onAfter = function (id) {
            var sid = null;
            if (id === "fbBtnPair") {
                sid = 0;
            }
            else if (id === "googleBtnPair") {
                sid = 1;
            }
            else if (id === "twitterBtnPair") {
                sid = 2;
            }
            $(".soc-ico[data-t=\"" + sid + "\"]").show();
        };
        return SettingsView;
    }(Views.ViewBase));
    Views.SettingsView = SettingsView;
})(Views || (Views = {}));
//# sourceMappingURL=SettingsView.js.map