var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FriendActionType;
(function (FriendActionType) {
    FriendActionType[FriendActionType["Confirm"] = 0] = "Confirm";
    FriendActionType[FriendActionType["Request"] = 1] = "Request";
    FriendActionType[FriendActionType["Unfriend"] = 2] = "Unfriend";
    FriendActionType[FriendActionType["Block"] = 3] = "Block";
    FriendActionType[FriendActionType["CancelRequest"] = 4] = "CancelRequest";
})(FriendActionType || (FriendActionType = {}));
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
})();
var FriendsView = (function (_super) {
    __extends(FriendsView, _super);
    function FriendsView() {
        _super.call(this);
    }
    Object.defineProperty(FriendsView.prototype, "pageType", {
        get: function () { return Views.PageType.Friends; },
        enumerable: true,
        configurable: true
    });
    FriendsView.prototype.initialize = function () {
        var self = this;
        this.getUsersAndDisplay();
        $("#friendsSearch").on("input", function () {
            var searchQuery = $("#friendsSearch input").val();
            self.searchUsers(searchQuery);
        });
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
        $("#friendsSearch li").unbind();
        $("#friendsSearch ul").html(htmlContent);
        $("#friendsSearch li").click(function (clickedUser) {
            //todo: to user detial
        });
        $("#friendsSearch button").click(function (e) {
            e.preventDefault();
            var userId = $(e.currentTarget).data("value");
            _this.requestUser(userId, users);
            $("#friendsSearch input").val("");
        });
    };
    FriendsView.prototype.getItemHtml = function (item) {
        var photoUrl = "/PortalUser/ProfilePicture/" + item.friendId;
        return "<li data-value=\"" + item.friendId + "\"><span class=\"thumbnail\"><img src=\"" + photoUrl + "\"></span>" + item.displayName + " <button data-value=\"" + item.friendId + "\">Request</button></li>";
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
        var allSectionsHtml = "";
        if (friendsResponse.Friends.length > 0) {
            var titleFriends = "Friends";
            var friends = this.convertFriends(friendsResponse.Friends, FriendshipState.Friends);
            allSectionsHtml += this.generateSection(titleFriends, friends);
        }
        if (friendsResponse.AwaitingConfirmation.length > 0) {
            var titleAwaiting = "Awaiting confirmation";
            var friendsAwaiting = this.convertFriends(friendsResponse.AwaitingConfirmation, FriendshipState.AwaitingConfirmation);
            allSectionsHtml += this.generateSection(titleAwaiting, friendsAwaiting);
        }
        if (friendsResponse.FacebookRecommended.length > 0) {
            var titleFbRecommended = "Recommended by Facebook";
            var friendsFbRec = this.convertFriends(friendsResponse.FacebookRecommended, FriendshipState.None);
            allSectionsHtml += this.generateSection(titleFbRecommended, friendsFbRec);
        }
        if (friendsResponse.Proposed.length > 0) {
            var titleProposed = "Already proposed friendship";
            var friendsProposed = this.convertFriends(friendsResponse.Proposed, FriendshipState.Proposed);
            allSectionsHtml += this.generateSection(titleProposed, friendsProposed);
        }
        return allSectionsHtml;
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
        var friendsHtml = '';
        friends.forEach(function (friend) {
            var actions = _this.getActionsByState(friend.state);
            var friendHtml = _this.generateOneFriendItem(friend, actions);
            friendsHtml += friendHtml;
        });
        var sectionHtml = "<div class=\"friendSection\"><div style=\"font-size: 30px\">" + sectionTitle + "</div>" + friendsHtml + "</div>";
        return sectionHtml;
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
    FriendsView.prototype.generateOneFriendItem = function (friend, actions) {
        var actionsHtml = this.generateActions(friend.friendId, actions);
        var photoUrl = "/PortalUser/ProfilePicture/" + friend.friendId;
        var itemHtml = "<div class=\"friend\"><img src=\"" + photoUrl + "\" style=\"width: 80px;\" /><br/><span>" + friend.displayName + "</span>" + actionsHtml + "</div>";
        return itemHtml;
    };
    FriendsView.prototype.generateActions = function (friendId, actions) {
        var actionsHtml = '';
        actions.forEach(function (action) {
            var actionText = FriendActionType[action];
            var actionHtml = '<button class="actionButton" data-value="' + friendId + '" data-action="' + action + '">' + actionText + '</button>';
            actionsHtml += actionHtml;
        });
        return actionsHtml;
    };
    return FriendsView;
})(Views.ViewBase);
//# sourceMappingURL=FriendsView.js.map