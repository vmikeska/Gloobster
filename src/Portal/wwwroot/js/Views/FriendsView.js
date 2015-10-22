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
    FriendshipState[FriendshipState["Friends"] = 0] = "Friends";
    FriendshipState[FriendshipState["Proposed"] = 1] = "Proposed";
    FriendshipState[FriendshipState["AwaitingConfirmation"] = 2] = "AwaitingConfirmation";
    FriendshipState[FriendshipState["Blocked"] = 3] = "Blocked";
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
    FriendsView.prototype.generateAllSections = function () {
    };
    FriendsView.prototype.generateSection = function (sectionTitle, friends) {
        var _this = this;
        var friendsHtml = '';
        friends.forEach(function (friend) {
            var photoUrl = "../images/sampleFace.png";
            var actions = _this.getActionsByState(friend.state);
            var friendHtml = _this.generateOneFriendItem(photoUrl, friend.friendId, actions);
            friendsHtml += friendHtml;
        });
        var sectionHtml = '<div class="friendSection">' + friendsHtml + '</div>';
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
        return [];
    };
    FriendsView.prototype.generateOneFriendItem = function (photoUrl, friendId, actions) {
        var actionsHtml = '';
        actions.forEach(function (action) {
            var actionText = FriendActionType[action];
            var actionHtml = '<button class="actionButton" data-value="' + friendId + '" data-action="' + action + '">' + actionText + '</button>';
            actionsHtml += actionHtml;
        });
        var itemItml = '<div class="friend"><img src="' + photoUrl + '"<div class="actions"></div></div>';
    };
    return FriendsView;
})(Views.ViewBase);
//# sourceMappingURL=FriendsView.js.map