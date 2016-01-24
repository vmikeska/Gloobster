var Views;
(function (Views) {
    var InviteDialogView = (function () {
        function InviteDialogView() {
            var _this = this;
            var config = new Common.UserSearchConfig();
            config.elementId = "friends";
            config.clearAfterSearch = true;
            config.endpoint = "FriendsSearch";
            this.$htmlContainer = $("#inviteFriendsCont");
            this.userSearchBox = new Common.UserSearchBox(config);
            this.userSearchBox.onUserSelected = function (user) { return _this.onUserSelected(user); };
            var source = $("#inviteDialogUser-template").html();
            this.template = Handlebars.compile(source);
            $("#invite").click(function () { return _this.invite(); });
        }
        InviteDialogView.prototype.invite = function () {
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
            Views.ViewBase.currentView.apiPost("TripParticipants", data, function (r) {
            });
        };
        InviteDialogView.prototype.onUserSelected = function (user) {
            this.addUser(user);
        };
        InviteDialogView.prototype.reregisterEvents = function () {
            var _this = this;
            var $delete = $(".userDelete");
            $delete.unbind();
            $delete.click(function (evnt) {
                var friendId = $(evnt.target).data("value");
                _this.removeUser(friendId);
            });
        };
        InviteDialogView.prototype.isAreadyAdded = function (userId) {
            var result = false;
            this.$htmlContainer.children().each(function (i, elm) {
                if (elm.id === userId) {
                    result = true;
                }
            });
            return result;
        };
        InviteDialogView.prototype.addUser = function (user) {
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
        InviteDialogView.prototype.getChecked = function (checked) {
            if (checked) {
                return "checked";
            }
            return "";
        };
        InviteDialogView.prototype.removeUser = function (friendId) {
            $("#" + friendId).remove();
        };
        return InviteDialogView;
    })();
    Views.InviteDialogView = InviteDialogView;
})(Views || (Views = {}));
//# sourceMappingURL=InviteDialogView.js.map