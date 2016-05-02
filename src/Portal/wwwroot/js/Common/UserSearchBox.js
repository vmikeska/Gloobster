var Common;
(function (Common) {
    var UserSearchBox = (function () {
        function UserSearchBox(config) {
            var _this = this;
            this.config = config;
            this.$root = $("#" + config.elementId);
            this.$input = this.$root.find("input");
            this.template = Views.ViewBase.currentView.registerTemplate("userItem-template");
            this.delayedCallback = new Common.DelayedCallback(this.$input);
            this.delayedCallback.callback = function (placeName) { return _this.searchUsers(placeName); };
        }
        UserSearchBox.prototype.searchUsers = function (name) {
            var _this = this;
            var params = [["name", name]];
            Views.ViewBase.currentView.apiGet(this.config.endpoint, params, function (places) {
                _this.fillSearchBoxHtml(places);
            });
        };
        UserSearchBox.prototype.fillSearchBoxHtml = function (users) {
            var _this = this;
            this.$root.find("ul").show();
            var htmlContent = "";
            users.forEach(function (item) {
                htmlContent += _this.getItemHtml(item);
            });
            this.$root.find("li").unbind();
            this.$root.find("ul").html(htmlContent);
            this.$root.find("li").click(function (clickedUser) {
                _this.selectUser(clickedUser, users);
            });
        };
        UserSearchBox.prototype.selectUser = function (clickedPlace, users) {
            var userId = $(clickedPlace.currentTarget).data("value");
            var clickedUserObj = _.find(users, function (user) { return (user.friendId === userId); });
            this.$root.find("ul").hide();
            if (this.config.clearAfterSearch) {
                this.$input.val("");
            }
            else {
                var selectedCaption = clickedUserObj.City + ", " + clickedUserObj.CountryCode;
                this.$input.val(selectedCaption);
            }
            if (this.onUserSelected) {
                this.onUserSelected(clickedUserObj);
            }
        };
        UserSearchBox.prototype.getItemHtml = function (item) {
            var context = {
                photoUrl: "/PortalUser/ProfilePicture_xs/" + item.friendId,
                userId: item.friendId,
                displayName: item.displayName
            };
            var html = this.template(context);
            return html;
        };
        return UserSearchBox;
    }());
    Common.UserSearchBox = UserSearchBox;
    var UserSearchConfig = (function () {
        function UserSearchConfig() {
        }
        return UserSearchConfig;
    }());
    Common.UserSearchConfig = UserSearchConfig;
})(Common || (Common = {}));
//# sourceMappingURL=UserSearchBox.js.map