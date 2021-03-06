var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FriendshipState;
(function (FriendshipState) {
    FriendshipState[FriendshipState["None"] = 0] = "None";
    FriendshipState[FriendshipState["Friends"] = 1] = "Friends";
    FriendshipState[FriendshipState["Proposed"] = 2] = "Proposed";
    FriendshipState[FriendshipState["AwaitingConfirmation"] = 3] = "AwaitingConfirmation";
    FriendshipState[FriendshipState["Blocked"] = 4] = "Blocked";
})(FriendshipState || (FriendshipState = {}));
var Friend = (function () {
    function Friend() {
    }
    return Friend;
}());
var FriendsView = (function (_super) {
    __extends(FriendsView, _super);
    function FriendsView() {
        _super.call(this);
    }
    Object.defineProperty(FriendsView.prototype, "pageType", {
        get: function () { return PageType.Friends; },
        enumerable: true,
        configurable: true
    });
    FriendsView.prototype.initialize = function () {
        var self = this;
        this.$usersTable = $("#usersTable");
        this.getUsersAndDisplay();
        $("#friendsSearch").on("input", function () {
            var searchQuery = $("#friendsSearch input").val();
            self.searchUsers(searchQuery);
        });
        this.friendItemTemplate = this.registerTemplate("friendItem-template");
        this.friendMenuTemplate = this.registerTemplate("friendMenu-template");
        this.friendSearchTemplate = this.registerTemplate("friend-search-item-template");
    };
    FriendsView.prototype.getUsersAndDisplay = function () {
        var self = this;
        $(".actionButton").unbind();
        this.apiGet("Friends", null, function (friendsResponse) {
            var allSectionsHtml = self.generateAllSections(friendsResponse);
            $(".friendsContainer").html(allSectionsHtml);
            self.registerButtonActions();
        });
    };
    FriendsView.prototype.searchUsers = function (searchQuery) {
        var _this = this;
        var minChars = 1;
        if (searchQuery.length < minChars) {
            this.clearSearchBox();
            return;
        }
        var params = [["searchQuery", searchQuery]];
        this.apiGet("usersSearch", params, function (users) {
            _this.fillUsersSearchBoxHtml(users);
        });
    };
    FriendsView.prototype.clearSearchBox = function () {
        $("#friendsSearch ul").html("");
    };
    FriendsView.prototype.fillUsersSearchBoxHtml = function (users) {
        var _this = this;
        $("#friendsSearch ul").show();
        var htmlContent = "";
        users.forEach(function (item) {
            htmlContent += _this.getItemHtml(item);
        });
        $("#friendsSearch ul").html(htmlContent);
        $("#friendsSearch button").click(function (e) {
            e.preventDefault();
            var userId = $(e.currentTarget).data("value");
            _this.requestUser(userId, users);
            $("#friendsSearch input").val("");
        });
    };
    FriendsView.prototype.getItemHtml = function (item) {
        var context = {
            friendId: item.friendId,
            displayName: item.displayName
        };
        var html = this.friendSearchTemplate(context);
        return html;
    };
    FriendsView.prototype.requestUser = function (userId, places) {
        var self = this;
        $("#friendsSearch ul").hide();
        var data = { "friendId": userId, "action": FriendActionType.Request };
        this.apiPost("Friends", data, function (response) {
            self.userStateChanged(response);
        });
    };
    FriendsView.prototype.generateAllSections = function (friendsResponse) {
        this.$usersTable.html('<tr><td colspan="3"></td></tr>');
        if (friendsResponse.Friends.length > 0) {
            var titleFriends = this.t("Friends", "jsFriends");
            var friends = this.convertFriends(friendsResponse.Friends, FriendshipState.Friends);
            this.generateSection(titleFriends, friends);
        }
        if (friendsResponse.AwaitingConfirmation.length > 0) {
            var titleAwaiting = this.t("AwaitingConfirm", "jsFriends");
            var friendsAwaiting = this.convertFriends(friendsResponse.AwaitingConfirmation, FriendshipState.AwaitingConfirmation);
            this.generateSection(titleAwaiting, friendsAwaiting);
        }
        if (friendsResponse.FacebookRecommended.length > 0) {
            var titleFbRecommended = this.t("RecommByFb", "jsFriends");
            var friendsFbRec = this.convertFriends(friendsResponse.FacebookRecommended, FriendshipState.None);
            this.generateSection(titleFbRecommended, friendsFbRec);
        }
        if (friendsResponse.Proposed.length > 0) {
            var titleProposed = this.t("AlreadyProposed", "jsFriends");
            var friendsProposed = this.convertFriends(friendsResponse.Proposed, FriendshipState.Proposed);
            this.generateSection(titleProposed, friendsProposed);
        }
    };
    FriendsView.prototype.registerButtonActions = function () {
        var self = this;
        $(".actionButton").click(function (e) {
            e.preventDefault();
            var friendId = $(e.target).data("value");
            var action = $(e.target).data("action");
            var data = { "friendId": friendId, "action": action };
            self.apiPost("Friends", data, function (response) {
                self.userStateChanged(response);
            });
        });
    };
    FriendsView.prototype.userStateChanged = function (friendsResponse) {
        $(".actionButton").unbind();
        var allSectionsHtml = this.generateAllSections(friendsResponse);
        $(".friendsContainer").html(allSectionsHtml);
        this.registerButtonActions();
    };
    FriendsView.prototype.convertFriends = function (friendsResponse, state) {
        var self = this;
        var friends = _.map(friendsResponse, function (friend) {
            return self.convertFriend(friend, state);
        });
        return friends;
    };
    FriendsView.prototype.convertFriend = function (friendResponse, state) {
        var friend = new Friend();
        friend.photoUrl = friendResponse.photoUrl;
        friend.friendId = friendResponse.friendId;
        friend.state = state;
        friend.displayName = friendResponse.displayName;
        return friend;
    };
    FriendsView.prototype.generateSection = function (sectionTitle, friends) {
        var _this = this;
        var title = "<tr><td class=\"sect-title\" colspan=\"3\"><h4>" + sectionTitle + "</h4></td></tr>";
        this.addRow(title);
        friends.forEach(function (friend) {
            _this.generateOneFriendItem(friend);
        });
    };
    FriendsView.prototype.getActionsByState = function (friendshipState) {
        if (friendshipState === FriendshipState.Friends) {
            return [FriendActionType.Unfriend];
        }
        if (friendshipState === FriendshipState.AwaitingConfirmation) {
            return [FriendActionType.Confirm];
        }
        if (friendshipState === FriendshipState.Proposed) {
            return [FriendActionType.CancelRequest];
        }
        if (friendshipState === FriendshipState.None) {
            return [FriendActionType.Request];
        }
        return [];
    };
    FriendsView.prototype.generateOneFriendItem = function (friend) {
        var actions = this.getActionsByState(friend.state);
        var actionsHtml = friend.state === FriendshipState.Friends ?
            this.generateFriendAction(friend.friendId) :
            this.generateActions(friend.friendId, actions);
        var context = {
            id: friend.friendId,
            name: friend.displayName,
            actionsHtml: actionsHtml
        };
        var itemHtml = this.friendItemTemplate(context);
        var $itemHtml = $(itemHtml);
        $itemHtml.find(".actions").html(actionsHtml);
        this.addRow($itemHtml);
    };
    FriendsView.prototype.addRow = function (html) {
        $("#usersTable tr:last").after(html);
    };
    FriendsView.prototype.generateFriendAction = function (friendId) {
        var _this = this;
        var html = this.friendMenuTemplate({ id: friendId });
        var $html = $(html);
        Common.DropDown.registerDropDown($html);
        $html.find(".unfriend").click(function (e) {
            e.preventDefault();
            var friendId = $(e.target).data("fid");
            var data = { "friendId": friendId, "action": FriendActionType.Unfriend };
            _this.apiPost("Friends", data, function (response) {
                _this.userStateChanged(response);
            });
        });
        return $html;
    };
    FriendsView.prototype.generateActions = function (friendId, actions) {
        var _this = this;
        var actionsHtml = "";
        actions.forEach(function (action) {
            var actionText = _this.t(FriendActionType[action], "jsFriends");
            var actionHtml = "<button class=\"actionButton\" data-value=\"" + friendId + "\" data-action=\"" + action + "\">" + actionText + "</button>";
            actionsHtml += actionHtml;
        });
        return actionsHtml;
    };
    return FriendsView;
}(Views.ViewBase));
//# sourceMappingURL=FriendsView.js.map