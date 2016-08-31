var Views;
(function (Views) {
    var PeopleFilter = (function () {
        function PeopleFilter() {
            this.defaults = [0];
            this.acls = "active";
            this.blockName = "data-set";
            this.itemTemplate = Views.ViewBase.currentView.registerTemplate("item-template");
            this.$block = $("." + this.blockName);
        }
        PeopleFilter.prototype.init = function () {
            var _this = this;
            this.initFriendsCmb();
            this.defaults.forEach(function (v) {
                _this.setSelection(v, true);
            });
            this.$block.find("a").click(function (e) {
                e.preventDefault();
                var $a = $(e.target).closest("a");
                var isActive = $a.hasClass(_this.acls);
                $a.toggleClass(_this.acls);
                var val = $a.data("gv");
                _this.setForm(val, !isActive);
                _this.onChange();
            });
        };
        PeopleFilter.prototype.initFriendsCmb = function () {
            var _this = this;
            var $cmbBtn = $("#friendsCmb");
            var $cmb = $cmbBtn.closest(".cmb_all");
            var $list = $cmb.find(".list");
            var $clear = $list.find(".clear");
            $cmbBtn.click(function (e) {
                e.preventDefault();
                $list.toggle();
            });
            $clear.find("a").click(function (e) {
                e.preventDefault();
                _this.setAllFriends(false);
            });
        };
        PeopleFilter.prototype.setForm = function (val, checked) {
            if (val === 0 && checked) {
                this.setSelection(2, false);
            }
            if (val === 1 && checked) {
                this.setSelection(2, false);
            }
            if (val === 2 && checked) {
                this.setSelection(0, false);
                this.setSelection(1, false);
            }
        };
        PeopleFilter.prototype.initFriends = function (friends) {
            var _this = this;
            var $list = this.$block.find(".list");
            var $clear = $list.find(".clear");
            var $cont = $list.find(".cont");
            friends.forEach(function (f) {
                var $item = $(_this.itemTemplate(f));
                var $chb = $item.find("input");
                $chb.change(function (e) {
                    var checked = _this.getCheckedFriends().length > 0;
                    $clear.toggle(checked);
                    _this.onChange();
                });
                $cont.append($item);
            });
        };
        PeopleFilter.prototype.getCheckedFriends = function () {
            var $list = this.$block.find(".list");
            var $cont = $list.find(".cont");
            var chbs = $cont.find("input").toArray();
            var result = [];
            chbs.forEach(function (cb) {
                var $cb = $(cb);
                var checked = $cb.prop("checked");
                if (checked) {
                    result.push($cb.data("val"));
                }
            });
            return result;
        };
        PeopleFilter.prototype.setAllFriends = function (checked) {
            var $list = this.$block.find(".list");
            var $clear = $list.find(".clear");
            var $cont = $list.find(".cont");
            var chbs = $cont.find("input").toArray();
            chbs.forEach(function (cb) {
                var $cb = $(cb);
                $cb.prop("checked", checked);
            });
            if (!checked) {
                $clear.toggle(false);
            }
        };
        PeopleFilter.prototype.getSeletedVals = function () {
            var _this = this;
            var $asel = _.filter(this.$block.find("a").toArray(), function (a) {
                var $aa = $(a);
                return $aa.hasClass(_this.acls);
            });
            var acts = _.map($asel, function (a) {
                return $(a).data("gv");
            });
            return acts;
        };
        PeopleFilter.prototype.hasValue = function (val) {
            var vals = this.getSeletedVals();
            return _.contains(vals, val);
        };
        PeopleFilter.prototype.justMeSelected = function () {
            var sel = this.getSelection();
            return sel.me && !sel.everybody && !sel.friends && (sel.singleFriends.length === 0);
        };
        PeopleFilter.prototype.getIcoByVal = function (val) {
            var $a = this.$block.find("a[data-gv=\"" + val + "\"]");
            return $a;
        };
        PeopleFilter.prototype.setSelection = function (val, selected) {
            var $a = this.getIcoByVal(val);
            if (selected) {
                $a.addClass(this.acls);
            }
            else {
                $a.removeClass(this.acls);
            }
        };
        PeopleFilter.prototype.getSelection = function () {
            var evnt = new Maps.PeopleSelection();
            evnt.me = this.hasValue(0);
            evnt.friends = this.hasValue(1);
            evnt.everybody = this.hasValue(2);
            evnt.singleFriends = this.getCheckedFriends();
            return evnt;
        };
        return PeopleFilter;
    }());
    Views.PeopleFilter = PeopleFilter;
})(Views || (Views = {}));
//# sourceMappingURL=PeopleFilter.js.map