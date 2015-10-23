enum FriendActionType { Confirm, Request, Unfriend, Block, CancelRequest}

enum FriendshipState { None, Friends, Proposed, AwaitingConfirmation, Blocked }

class Friend {
	friendId: string;
	state: FriendshipState;
	photoUrl: string;
}

class FriendsView extends Views.ViewBase {

	constructor() {
		super();
	}

	public initialize() {
		var self = this;
		this.apiGet("Friends", null, friendsResponse => {
			var allSectionsHtml = self.generateAllSections(friendsResponse);
			$(".friendsContainer").html(allSectionsHtml);
		});
	}

	get pageType(): Views.PageType { return Views.PageType.Friends; }

	public generateAllSections(friendsResponse) {

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
	}

	private convertFriends(friendsResponse, state: FriendshipState) {
		var self = this;
		var friends = _.map(friendsResponse, friend => {
			return self.convertFriend(friend, state);
		});
		return friends;
	}

	private convertFriend(friendResponse, state: FriendshipState) {
		var friend = new Friend();
		friend.photoUrl = friendResponse.PhotoUrl;
		friend.friendId = friendResponse.FriendId;
		friend.state = state;
		return friend;
	}

	private generateSection(sectionTitle: string, friends: Friend[]): string {		
		var friendsHtml = '';
		friends.forEach(friend => {
			var photoUrl = "../images/sampleFace.jpg";

			var actions = this.getActionsByState(friend.state);

			var friendHtml = this.generateOneFriendItem(photoUrl, friend.friendId, actions);
			friendsHtml += friendHtml;
		});

		var sectionHtml = '<div class="friendSection"><div>' + sectionTitle + '</div>' + friendsHtml + '</div>';

		return sectionHtml;
	}

	private getActionsByState(friendshipState: FriendshipState): FriendActionType[] {

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
	}

	private generateOneFriendItem(photoUrl: string, friendId: string, actions: FriendActionType[]) {

		var actionsHtml = '';
		actions.forEach(action => {

			var actionText = FriendActionType[action];

			var actionHtml = '<button class="actionButton" data-value="' + friendId + '" data-action="' + action + '">' + actionText + '</button>';
			actionsHtml += actionHtml;
		});

		var itemHtml = '<div class="friend"><img src="' + photoUrl + '" />'+ actionsHtml + '</div>';
		return itemHtml;
	}
}