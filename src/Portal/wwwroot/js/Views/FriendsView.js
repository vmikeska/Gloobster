var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    FriendsView.prototype.initialize = function () {
        var self = this;
        this.apiGet("Friends", null, function (friendsResponse) {
            var allSectionsHtml = self.generateAllSections(friendsResponse);
            $(".friendsContainer").html(allSectionsHtml);
        });
    };
    Object.defineProperty(FriendsView.prototype, "pageType", {
        get: function () { return Views.PageType.Friends; },
        enumerable: true,
        configurable: true
    });
    FriendsView.prototype.generateAllSections = function (friendsResponse) {
        var allSectionsHtml = "";
        var sectionTitleFriends = "Friends";
        var friends = this.convertFriends(friendsResponse.Friends, FriendshipState.Friends);
        var friendsSectionHtml = this.generateSection(sectionTitleFriends, friends);
        allSectionsHtml += friendsSectionHtml;
        var sectionTitleFacebookRecommended = "Recommended by Facebook";
        var facebookRecommended = this.convertFriends(friendsResponse.FacebookRecommended, FriendshipState.None);
        var fbRecSectionHtml = this.generateSection(sectionTitleFacebookRecommended, facebookRecommended);
        allSectionsHtml += fbRecSectionHtml;
        return allSectionsHtml;
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
        friend.photoUrl = friendResponse.PhotoUrl;
        friend.friendId = friendResponse.FriendId;
        friend.state = state;
        return friend;
    };
    FriendsView.prototype.generateSection = function (sectionTitle, friends) {
        var _this = this;
        var friendsHtml = '';
        friends.forEach(function (friend) {
            var photoUrl = "../images/sampleFace.jpg";
            var actions = _this.getActionsByState(friend.state);
            var friendHtml = _this.generateOneFriendItem(photoUrl, friend.friendId, actions);
            friendsHtml += friendHtml;
        });
        var sectionHtml = '<div class="friendSection"><div>' + sectionTitle + '</div>' + friendsHtml + '</div>';
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
    FriendsView.prototype.generateOneFriendItem = function (photoUrl, friendId, actions) {
        var actionsHtml = '';
        actions.forEach(function (action) {
            var actionText = FriendActionType[action];
            var actionHtml = '<button class="actionButton" data-value="' + friendId + '" data-action="' + action + '">' + actionText + '</button>';
            actionsHtml += actionHtml;
        });
        var itemHtml = '<div class="friend"><img src="' + photoUrl + '" />' + actionsHtml + '</div>';
        return itemHtml;
    };
    return FriendsView;
})(Views.ViewBase);
//# sourceMappingURL=FriendsView.js.map