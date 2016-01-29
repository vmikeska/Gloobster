var Views;
(function (Views) {
    var PeopleFilter = (function () {
        function PeopleFilter() {
            var _this = this;
            this.$userFilter = $(".usersFilterComponent");
            this.$userFilterContent = $(".userFilterContent");
            this.$usersBox = $(".userFilterContent");
            this.itemTemplate = Views.ViewBase.currentView.registerTemplate("item-template");
            this.$userFilter.click(function (e) {
                _this.showHide();
            });
            this.initBase();
        }
        PeopleFilter.prototype.initBase = function () {
            var html = "";
            var isLogged = Views.ViewBase.currentView.loginManager.isAlreadyLogged();
            if (isLogged) {
                html +=
                    this.itemTemplate({ id: "Me", displayName: "Me", checked: true }) +
                        this.itemTemplate({ id: "Friends", displayName: "Friends" }) +
                        this.itemTemplate({ id: "Everybody", displayName: "Everybody" });
            }
            else {
                var $h = $(this.itemTemplate({ id: "Everybody", displayName: "Everybody", checked: true }));
                $h.find("input").prop("disabled", true);
                html = $h;
            }
            this.$userFilterContent.prepend(html);
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
            $(".filterCheckbox").click(function (e) {
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
            if (id === "chckEverybody" && checked) {
                $(".filterCheckbox").not("#chckEverybody").prop("checked", false);
            }
            else {
                $("#chckEverybody").prop("checked", false);
            }
            var singleFriendChecked = ((id !== "chckEverybody" && id !== "chckMe" && id !== "chckFriends") && checked);
            if (singleFriendChecked) {
                $("#chckFriends").prop("checked", false);
            }
            if (id === "chckFriends" && checked) {
                $(".filterCheckbox").not("#chckEverybody").not("#chckMe").not("#chckFriends").prop("checked", false);
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