enum FriendActionType { Confirm, Request, Unfriend, Block, CancelRequest}

enum FriendshipState { Friends, Proposed, AwaitingConfirmation, Blocked }

class Friend {
	friendId: string;
	state: FriendshipState;
	photoUrl: string;
}

class FriendsView extends Views.ViewBase {

	constructor() {		
	 super();	 
	}

	get pageType(): Views.PageType { return Views.PageType.Friends; }

 public generateAllSections() {
	 
 }


 private generateSection(sectionTitle: string, friends: Friend[]): string {

	 var friendsHtml = '';
	 friends.forEach(friend => {		
		var photoUrl = "../images/sampleFace.png";

		 var actions = this.getActionsByState(friend.state);

		 var friendHtml = this.generateOneFriendItem(photoUrl, friend.friendId, actions);
		 friendsHtml += friendHtml;
	 });

	 var sectionHtml = '<div class="friendSection">' + friendsHtml + '</div>';

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

	 return [];
 }

 private generateOneFriendItem(photoUrl: string, friendId: string, actions: FriendActionType[]) {

	 var actionsHtml = '';
	 actions.forEach(action => {

		 var actionText = FriendActionType[action];

		 var actionHtml = '<button class="actionButton" data-value="' + friendId + '" data-action="' + action + '">' + actionText + '</button>';
		 actionsHtml += actionHtml;
	 });

	 var itemItml = '<div class="friend"><img src="' + photoUrl + '"<div class="actions"></div></div>';

 }
}