var Views;
(function (Views) {
    var ShareDialogView = (function () {
        function ShareDialogView() {
            var _this = this;
            var config = new Common.UserSearchConfig();
            config.elementId = "friends";
            config.clearAfterSearch = true;
            config.endpoint = "FriendsSearch";
            this.$htmlContainer = $("#shareFreindsContainer");
            this.userSearchBox = new Common.UserSearchBox(config);
            this.userSearchBox.onUserSelected = function (user) { return _this.onUserSelected(user); };
            var source = $("#shareDialogUser-template").html();
            this.template = Handlebars.compile(source);
            $("#share").click(function () { return _this.share(); });
        }
        ShareDialogView.prototype.share = function () {
            var users = [];
            this.$htmlContainer.children().each(function (i, elm) {
                var isUser = elm.id !== "";
                if (isUser) {
                    var isAdmin = $(elm).find("input[type=checkbox]").prop("checked");
                    var user = {
                        userId: elm.id,
                        isAdmin: isAdmin
                    };
                    users.push(user);
                }
            });
            var data = {
                caption: $("#caption").val(),
                tripId: Views.ViewBase.currentView["trip"].tripId,
                users: users
            };
            Views.ViewBase.currentView.apiPost("tripShare", data, function (response) {
            });
        };
        ShareDialogView.prototype.onUserSelected = function (user) {
            this.addUser(user);
        };
        ShareDialogView.prototype.reregisterEvents = function () {
            var _this = this;
            var $delete = $(".userDelete");
            $delete.unbind();
            $delete.click(function (evnt) {
                var friendId = $(evnt.target).data("value");
                _this.removeUser(friendId);
            });
        };
        ShareDialogView.prototype.isAreadyAdded = function (userId) {
            var result = false;
            this.$htmlContainer.children().each(function (i, elm) {
                if (elm.id === userId) {
                    result = true;
                }
            });
            return result;
        };
        ShareDialogView.prototype.addUser = function (user) {
            var isAdded = this.isAreadyAdded(user.friendId);
            if (isAdded) {
                return;
            }
            var canEdit = $("#isAdmin").prop("checked");
            var context = {
                photoUrl: "/images/samples/sample11.jpg",
                displayName: user.displayName,
                userId: user.friendId,
                checked: this.getChecked(canEdit)
            };
            var html = this.template(context);
            this.$htmlContainer.prepend(html);
            this.reregisterEvents();
        };
        ShareDialogView.prototype.getChecked = function (checked) {
            if (checked) {
                return "checked";
            }
            return "";
        };
        ShareDialogView.prototype.removeUser = function (friendId) {
            $("#" + friendId).remove();
        };
        return ShareDialogView;
    })();
    Views.ShareDialogView = ShareDialogView;
})(Views || (Views = {}));
//# sourceMappingURL=ShareDialogView.js.map