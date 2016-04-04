var Views;
(function (Views) {
    var PeopleFilter = (function () {
        function PeopleFilter() {
            this.$userFilter = $(".usersFilterComponent");
            this.$usersBox = this.$userFilter.find("ul");
            this.itemTemplate = Views.ViewBase.currentView.registerTemplate("item-template");
            this.initBase();
        }
        PeopleFilter.prototype.justMeSelected = function () {
            var sel = this.getSelection();
            return sel.me && !sel.everybody && !sel.friends && (sel.singleFriends.length === 0);
        };
        PeopleFilter.prototype.initBase = function () {
            var html = this.itemTemplate({ id: "Me", displayName: "Me", checked: true, hasIco: true, ico: "icon-personal" }) +
                this.itemTemplate({ id: "Friends", displayName: "Friends", hasIco: true, ico: "icon-people" }) +
                this.itemTemplate({ id: "Everybody", displayName: "Everybody", hasIco: true, ico: "icon-globe" });
            this.$usersBox.prepend(html);
        };
        PeopleFilter.prototype.initFriends = function (friends) {
            var _this = this;
            friends.forEach(function (f) {
                var html = _this.itemTemplate(f);
                _this.$usersBox.append(html);
            });
            this.onUsersRendered();
        };
        PeopleFilter.prototype.onUsersRendered = function () {
            var _this = this;
            this.$usersBox.find("input").change(function (e) {
                var $target = $(e.target);
                var id = $target.attr("id");
                var checked = $target.prop("checked");
                _this.setForm(id, checked);
                if (_this.onSelectionChanged) {
                    var selection = _this.getSelection();
                    _this.onSelectionChanged(selection);
                }
            });
        };
        PeopleFilter.prototype.getSelection = function () {
            var evnt = new Maps.PeopleSelection();
            evnt.me = $("#chckMe").prop("checked");
            evnt.friends = $("#chckFriends").prop("checked");
            evnt.everybody = $("#chckEverybody").prop("checked");
            evnt.singleFriends = [];
            var singleUsers = $(".filterCheckbox").not("#chckEverybody").not("#chckMe").not("#chckFriends").toArray();
            singleUsers.forEach(function (u) {
                var $u = $(u);
                if ($u.prop("checked")) {
                    var id = $u.attr("id").replace("chck", "");
                    evnt.singleFriends.push(id);
                }
            });
            return evnt;
        };
        PeopleFilter.prototype.setForm = function (id, checked) {
            var $chbcks = this.$usersBox.find("input");
            if (id === "chckEverybody" && checked) {
                $chbcks.not("#chckEverybody").prop("checked", false);
            }
            else {
                $("#chckEverybody").prop("checked", false);
            }
            var singleFriendChecked = ((id !== "chckEverybody" && id !== "chckMe" && id !== "chckFriends") && checked);
            if (singleFriendChecked) {
                $("#chckFriends").prop("checked", false);
            }
            if (id === "chckFriends" && checked) {
                $chbcks.not("#chckEverybody").not("#chckMe").not("#chckFriends").prop("checked", false);
            }
        };
        PeopleFilter.prototype.showHide = function () {
            this.$userFilterContent.toggle();
        };
        return PeopleFilter;
    })();
    Views.PeopleFilter = PeopleFilter;
})(Views || (Views = {}));
//# sourceMappingURL=PeopleFilter.js.map