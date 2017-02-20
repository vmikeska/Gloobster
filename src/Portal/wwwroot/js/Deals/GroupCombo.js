var Planning;
(function (Planning) {
    var GroupCombo = (function () {
        function GroupCombo() {
            this.ocls = "opened";
            this.selected = Planning.LocationGrouping.ByCity;
        }
        GroupCombo.prototype.init = function (section, $sect, groupings) {
            var _this = this;
            this.section = section;
            this.$sect = $sect;
            this.$formCont = $sect.find(".cat-drop-cont .cont");
            this.$cmb = this.$sect.find(".order-combo");
            this.$win = this.$sect.find(".order-sel");
            this.$cmb.click(function (e) {
                var opened = _this.isOpened();
                if (!opened) {
                    _this.initMenu();
                }
                _this.section.setMenuContVisibility(!opened);
                _this.setState(!opened);
            });
            this.groupings = groupings;
        };
        GroupCombo.prototype.reset = function () {
            this.setState(false);
            this.$cmb.removeClass(this.ocls);
        };
        GroupCombo.prototype.initMenu = function () {
            var _this = this;
            var items = [];
            this.groupings.forEach(function (i) {
                var item = {
                    id: i,
                    icon: "",
                    txt: ""
                };
                if (i === Planning.LocationGrouping.ByCity) {
                    item.icon = "city";
                    item.txt = "By city";
                }
                if (i === Planning.LocationGrouping.ByCountry) {
                    item.icon = "country";
                    item.txt = "By country";
                }
                if (i === Planning.LocationGrouping.ByContinent) {
                    item.icon = "continent";
                    item.txt = "By continent";
                }
                items.push(item);
            });
            var $c = $("<div class=\"order-sel\"></div>");
            this.$formCont.html($c);
            var lg = Common.ListGenerator.init($c, "grouping-itm-tmp");
            lg.clearCont = true;
            lg.evnt(null, function (e, $item, $target, item) {
                _this.selected = item.id;
                _this.setState(false);
                _this.setCmb(item.icon, item.txt);
                if (_this.onChange) {
                    _this.onChange();
                }
            });
            lg.generateList(items);
        };
        GroupCombo.prototype.isOpened = function () {
            return this.$cmb.hasClass(this.ocls);
        };
        GroupCombo.prototype.setCmb = function (ico, txt) {
            this.$cmb.find(".sel-ico").attr("class", "icon-" + ico + " sel-ico");
            this.$cmb.find(".txt").html(txt);
        };
        GroupCombo.prototype.setState = function (opened) {
            if (opened) {
                this.$win.removeClass("hidden");
                this.$cmb.addClass(this.ocls);
            }
            else {
                this.$win.addClass("hidden");
                this.$cmb.removeClass(this.ocls);
            }
        };
        return GroupCombo;
    }());
    Planning.GroupCombo = GroupCombo;
})(Planning || (Planning = {}));
//# sourceMappingURL=GroupCombo.js.map