var TravelB;
(function (TravelB) {
    var EmptyProps = (function () {
        function EmptyProps(view) {
            this.view = view;
        }
        EmptyProps.prototype.generateProps = function (props) {
            var _this = this;
            if (props.length === 0) {
                return;
            }
            Views.SettingsUtils.registerAvatarFileUpload("avatarFile", function () {
                _this.tbValids.valAvatarBody($("#avatarFile"), $(".photo-cont"), _this.avatarValItem);
                _this.tbValids.changed();
            });
            this.homeCity = Views.SettingsUtils.registerLocationCombo($("#homeCity"), "HomeLocation");
            this.currentCity = Views.SettingsUtils.registerLocationCombo($("#currentCity"), "CurrentLocation");
            this.homeCity.setText(this.view.homeLocation);
            Views.SettingsUtils.registerEdit("firstName", "FirstName", function (value) {
                return { name: value };
            });
            Views.SettingsUtils.registerEdit("lastName", "LastName", function (value) {
                return { name: value };
            });
            Views.SettingsUtils.registerEdit("birthYear", "BirthYear", function (value) {
                return { year: value };
            });
            Views.SettingsUtils.registerCombo("gender", function (val) {
                return { propertyName: "Gender", values: { gender: val } };
            });
            this.langsTagger = Views.SettingsUtils.initLangsTagger(this.view.defaultLangs);
            this.createTbVals();
            var $v = $(".all-valid");
            $v.find(".lbtn").click(function (e) {
                e.preventDefault();
                $(".required-settings").hide();
            });
        };
        EmptyProps.prototype.createTbVals = function () {
            var _this = this;
            this.tbValids = new TravelB.FormValidations();
            this.tbValids.valMessage($("#firstName"), $("#firstName"));
            this.tbValids.valMessage($("#lastName"), $("#lastName"));
            this.tbValids.valMessage($("#birthYear"), $("#birthYear"), Views.SettingsUtils.yearValidation);
            this.tbValids.valPlace(this.homeCity, $("#homeCity"), $("#homeCity input"));
            this.tbValids.valPlace(this.currentCity, $("#currentCity"), $("#currentCity input"));
            this.tbValids.valTagger(this.langsTagger, $("#langsTagging input"));
            this.tbValids.valDropDownVal($("#gender"), $("#gender .selected"), Gender.N);
            this.avatarValItem = this.tbValids.valAvatar($("#avatarFile"), $(".photo-cont"));
            this.tbValids.onChange = function () {
                var valid = _this.tbValids.isAllValid();
                var $v = $(".all-valid");
                if (valid) {
                    $v.show();
                }
                else {
                    $v.hide();
                }
            };
        };
        return EmptyProps;
    }());
    TravelB.EmptyProps = EmptyProps;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=EmptyProps.js.map