enum FriendActionType { Confirm, Request, Unfriend, Block, CancelRequest}

enum FriendshipState { None, Friends, Proposed, AwaitingConfirmation, Blocked }

class Friend {
	friendId: string;
	displayName: string;
	state: FriendshipState;
	photoUrl: string;
}

class FriendsView extends Views.ViewBase {

 private friendItemTemplate;
 private friendMenuTemplate;

 private $usersTable;

	constructor() {
		super();
	}

	get pageType(): Views.PageType { return Views.PageType.Friends; }

	public initialize() {
	 var self = this;
		this.$usersTable = $("#usersTable");
		this.getUsersAndDisplay();
	 
		$("#friendsSearch").on("input", () => {
		 var searchQuery = $("#friendsSearch input").val();
		 self.searchUsers(searchQuery);
		});

		this.friendItemTemplate = this.registerTemplate("friendItem-template");
		this.friendMenuTemplate = this.registerTemplate("friendMenu-template");
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
		var minChars = 1;

		if (searchQuery.length < minChars) {
			this.clearSearchBox();
		 return;
		}

		var params = [["searchQuery", searchQuery]];
		this.apiGet("usersSearch", params, users => {
			this.fillUsersSearchBoxHtml(users);
		});

	}

  private clearSearchBox() {
	  $("#friendsSearch ul").html("");
  }

	private fillUsersSearchBoxHtml(users) {
		$("#friendsSearch ul").show();
		var htmlContent = "";
		users.forEach(item => {
			 htmlContent += this.getItemHtml(item);
		});

		
		$("#friendsSearch ul").html(htmlContent);

		$(".userLink").click((e) => {
		 e.preventDefault();
			var $target = $(e.target);
			var $li = $target.closest("li");
			var id = $li.data("value");
			window.location.href = `/portalUser/detail/${id}`;
		});

		$("#friendsSearch button").click(e => {
			e.preventDefault();

		 var userId = $(e.currentTarget).data("value");
		 this.requestUser(userId, users);
			$("#friendsSearch input").val("");
		});
	}

	private getItemHtml(item) {
	 var photoUrl = "/PortalUser/ProfilePicture_s/" + item.friendId;
	 return `<li data-value="${item.friendId}"><span class="thumbnail"><img src="${photoUrl}"></span><a class="userLink" href="#">${item.displayName}</a> <button class="requestButton" data-value="${item.friendId}">${this.t("Request", "jsFriends")}</button></li>`;
	}

	requestUser(userId, places) {
		var self = this;
	
		$("#friendsSearch ul").hide();

		var data = { "friendId": userId, "action": FriendActionType.Request };
		this.apiPost("Friends", data, response => {
			self.userStateChanged(response);
		});
	}

	public generateAllSections(friendsResponse) {
	 
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
	}

	private registerButtonActions() {
		var self = this;

		$(".actionButton").click(e => {
			e.preventDefault();
			var friendId = $(e.target).data("value");
			var action = $(e.target).data("action");

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

	private generateSection(sectionTitle: string, friends: Friend[]) {
	 var title = `<tr><td colspan="3"><h4>${sectionTitle}</h4></td></tr>`;
	 this.addRow(title);

		friends.forEach(friend => {
			this.generateOneFriendItem(friend);
		});
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

	private generateOneFriendItem(friend: Friend) {
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
	}

	private addRow(html) {
	  $("#usersTable tr:last").after(html);
  }

  private generateFriendAction(friendId) {
	  var html = this.friendMenuTemplate({ id: friendId });
		var $html = $(html);
		$html.find(".unfriend").click(e => {
		 e.preventDefault();
		 var friendId = $(e.target).data("fid");
		 
		 var data = { "friendId": friendId, "action": FriendActionType.Unfriend };
		 this.apiPost("Friends", data, response => {
			this.userStateChanged(response);
		 });
		});
	  return $html;
  }

	private generateActions(friendId: string, actions: FriendActionType[]) {
		var actionsHtml = "";
		actions.forEach(action => {

			var actionText = this.t(FriendActionType[action], "jsFriends");

			var actionHtml = `<button class="actionButton" data-value="${friendId}" data-action="${action}">${actionText}</button>`;
			actionsHtml += actionHtml;
		});

		return actionsHtml;
	}
}