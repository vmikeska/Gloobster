enum FriendActionType { Confirm, Request, Unfriend, Block, CancelRequest}

enum FriendshipState { None, Friends, Proposed, AwaitingConfirmation, Blocked }

class Friend {
	friendId: string;
	displayName: string;
	state: FriendshipState;
	photoUrl: string;
}

class FriendsView extends Views.ViewBase {

	constructor() {
		super();
	}

	get pageType(): Views.PageType { return Views.PageType.Friends; }

	public initialize() {
		var self = this;
		this.getUsersAndDisplay();


		$("#friendsSearch").on("input", () => {
		 var searchQuery = $("#friendsSearch input").val();
		 self.searchUsers(searchQuery);
		});
	}

 public getUsersAndDisplay() {
	var self = this;

	 $(".actionButton").unbind();

	this.apiGet("Friends", null, friendsResponse => {
			var allSectionsHtml = self.generateAllSections(friendsResponse);
			$(".friendsContainer").html(allSectionsHtml);
			self.registerButtonActions();
		});
 }

	public searchUsers(searchQuery: string) {
		var minChars = 2;

		if (searchQuery.length < minChars) {
			return;
		}

		var params = [["searchQuery", searchQuery]];
		super.apiGet("usersSearch", params, users => { this.fillUsersSearchBoxHtml(users); });

	}

	fillUsersSearchBoxHtml(users) {
		$("#friendsSearch ul").show();
		var htmlContent = "";
		users.forEach(item => { htmlContent += this.getItemHtml(item); });

		$("#friendsSearch li").unbind();
		$("#friendsSearch ul").html(htmlContent);

		$("#friendsSearch li").click(clickedUser => {
			//todo: to user detial
		});

		$("#friendsSearch button").click(clickedUser => {
			this.requestUser(clickedUser, users);
			$("#friendsSearch input").val("");
		});
	}

	requestUser(clickedUser, places) {
		var self = this;
		var userId = $(clickedUser.currentTarget).data("value");

		$("#friendsSearch ul").hide();

		var data = { "friendId": userId, "action": FriendActionType.Request };
		this.apiPost("Friends", data, response => {
			self.userStateChanged(response);
		});
	}

	getItemHtml(item) {

	 var photoUrl = "../images/sampleFace.jpg";
	 return '<li data-value="' + item.friendId + '"><span class="thumbnail"><img src="' + photoUrl + '"></span>' + item.displayName + ' <button data-value="' + item.friendId + '">Request</button></li>';
	}











	public generateAllSections(friendsResponse) {

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
	}

	private registerButtonActions() {
		var self = this;

		$(".actionButton").click(evnt => {
			var friendId = $(evnt.target).data("value");
			var action = $(evnt.target).data("action");

			var data = { "friendId": friendId, "action": action };
			self.apiPost("Friends", data, response => {
				self.userStateChanged(response);
			});

		});
	}

	private userStateChanged(friendsResponse) {
		$(".actionButton").unbind();

		var allSectionsHtml = this.generateAllSections(friendsResponse);
		$(".friendsContainer").html(allSectionsHtml);
		this.registerButtonActions();
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
		friend.photoUrl = friendResponse.photoUrl;
		friend.friendId = friendResponse.friendId;
		friend.state = state;
		friend.displayName = friendResponse.displayName;
		return friend;
	}

	private generateSection(sectionTitle: string, friends: Friend[]): string {
		var friendsHtml = '';
		friends.forEach(friend => {
			var actions = this.getActionsByState(friend.state);

			var friendHtml = this.generateOneFriendItem(friend, actions);
			friendsHtml += friendHtml;
		});

		var sectionHtml = '<div class="friendSection"><div style="font-size: 30px">' + sectionTitle + '</div>' + friendsHtml + '</div>';

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

	private generateOneFriendItem(friend: Friend, actions: FriendActionType[]) {
		var actionsHtml = this.generateActions(friend.friendId, actions);

		var photoUrl = "../images/sampleFace.jpg";

		var itemHtml = '<div class="friend"><img src="' + photoUrl + '" /><br/><span>' + friend.displayName + '</span>' + actionsHtml + '</div>';
		return itemHtml;
	}

	private generateActions(friendId: string, actions: FriendActionType[]) {
		var actionsHtml = '';
		actions.forEach(action => {

			var actionText = FriendActionType[action];

			var actionHtml = '<button class="actionButton" data-value="' + friendId + '" data-action="' + action + '">' + actionText + '</button>';
			actionsHtml += actionHtml;
		});

		return actionsHtml;
	}
}