var TravelB;
(function (TravelB) {
    var EmptyProps = (function () {
        function EmptyProps() {
            this.formTemp = Views.ViewBase.currentView.registerTemplate("settings-template");
            this.setTemp = Views.ViewBase.currentView.registerTemplate("settingsStat-template");
        }
        EmptyProps.prototype.generateProps = function (props) {
            var _this = this;
            this.$cont = $("#reqPropCont");
            var $form = $(this.formTemp());
            this.$table = $form.find("table");
            this.appSignals(this.$table);
            this.$cont.html($form);
            if (props.length > 0) {
                this.$cont.show();
            }
            props.forEach(function (prop) {
                _this.visible(prop, $form);
                if (prop === "HasProfileImage") {
                    Views.SettingsUtils.registerAvatarFileUpload("avatarFile", function () {
                        _this.validate(true, "HasProfileImage");
                    });
                }
                if (prop === "FirstName") {
                    Views.SettingsUtils.registerEdit("firstName", "FirstName", function (value) {
                        _this.validate((value.length > 0), "FirstName");
                        return { name: value };
                    });
                }
                if (prop === "LastName") {
                    Views.SettingsUtils.registerEdit("lastName", "LastName", function (value) {
                        _this.validate((value.length > 0), "LastName");
                        return { name: value };
                    });
                }
                if (prop === "BirthYear") {
                    Views.SettingsUtils.registerEdit("birthYear", "BirthYear", function (value) {
                        _this.validate((value.length === 4), "BirthYear");
                        return { year: value };
                    });
                }
                if (prop === "Gender") {
                    Views.SettingsUtils.registerCombo("gender", function (val) {
                        _this.validate((val !== Gender.N), "Gender");
                        return { propertyName: "Gender", values: { gender: val } };
                    });
                    Common.DropDown.registerDropDown($("#gender"));
                }
                if (prop === "FamilyStatus") {
                    Views.SettingsUtils.registerCombo("familyStatus", function (val) {
                        _this.validate((val !== 0), "FamilyStatus");
                        return { propertyName: "FamilyStatus", values: { status: val } };
                    });
                    Common.DropDown.registerDropDown($("#familyStatus"));
                }
                if (prop === "HomeLocation") {
                    Views.SettingsUtils.registerLocationCombo("homeCity", "HomeLocation", function () {
                        _this.validate(true, "HomeLocation");
                    });
                }
                if (prop === "Languages") {
                    var tl = Views.SettingsUtils.initLangsTagger([]);
                    tl.onChange = function (items) {
                        _this.validate(items.length > 0, "Languages");
                    };
                }
                if (prop === "Interests") {
                    _this.initInterests();
                }
            });
        };
        EmptyProps.prototype.initInterests = function () {
            var _this = this;
            var $c = $("#intersTagging");
            this.interests = new TravelB.CategoryTagger();
            this.interests.onFilterChange = (function (addedOrDeleted, id) {
                var action = addedOrDeleted ? "ADD" : "DEL";
                Views.SettingsUtils.callServer("Inters", { value: id, action: action }, function () {
                    var cnt = _this.interests.getSelectedIds().length;
                    _this.validate(cnt > 0, "Interests");
                });
            });
            var data = TravelB.TravelBUtils.getInterestsTaggerData();
            this.interests.create($c, "required", data);
        };
        EmptyProps.prototype.validate = function (res, name) {
            if (res) {
                this.okStat(name);
            }
            else {
                this.koStat(name);
            }
        };
        EmptyProps.prototype.okStat = function (name) {
            var $tr = $("#tr" + name);
            var $stat = $tr.find(".stat");
            $stat.attr("src", "../images/tb/ok.png");
            $tr.find(".close").show();
            if (this.$table.find("tr").length === 0) {
                this.$cont.hide();
            }
        };
        EmptyProps.prototype.koStat = function (name) {
            var $tr = $("#tr" + name);
            var $stat = $tr.find(".stat");
            $stat.attr("src", "../images/tb/ko.png");
            $tr.find(".close").hide();
        };
        EmptyProps.prototype.appSignals = function ($table) {
            var _this = this;
            var trs = $table.find("tr").toArray();
            trs.forEach(function (tr) {
                var $tr = $(tr);
                var $stat = $(_this.setTemp());
                $tr.append($stat);
                $tr.find(".close").click(function (e) {
                    e.preventDefault();
                    $tr.remove();
                });
            });
        };
        EmptyProps.prototype.visible = function (name, $form) {
            var tr = $form.find("#tr" + name);
            tr.show();
        };
        return EmptyProps;
    }());
    TravelB.EmptyProps = EmptyProps;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=EmptyProps.js.map