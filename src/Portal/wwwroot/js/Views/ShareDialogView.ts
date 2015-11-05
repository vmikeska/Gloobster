class ShareDialogView {
	
 private userSearchBox: UserSearchBox;
 //private selectedUsers = [];
 private template: any;
 private $htmlContainer: any;
 private owner: TripDetailView;

 constructor(currentView) {
	 this.owner = currentView;

	 var config = new UserSearchConfig();
		config.owner = currentView;
		config.elementId = "friends";
		config.clearAfterSearch = true;
		config.endpoint = "FriendsSearch";

		this.$htmlContainer = $("#shareFreindsContainer");
	
		this.userSearchBox = new UserSearchBox(config);
		this.userSearchBox.onUserSelected = (user) => this.onUserSelected(user);

		var source = $("#shareDialogUser-template").html();
		this.template = Handlebars.compile(source);
	
		$("#share").click(() => this.share());

 }

	private share() {
		var users = [];
		this.$htmlContainer.children().each((i, elm) => {
			var isUser = elm.id !== "";
			if (isUser) {
				var isAdmin = $(elm).find("input[type=checkbox]").prop("checked");

				var user = {
					userId: elm.id,
					isAdmin: isAdmin
				}
				users.push(user);
			}
		});

		var data = {
			caption: $("#caption").val(),
			tripId: this.owner.trip.tripId,
			users: users
		}

	 this.owner.apiPost("tripShare", data, response => {
		 
	 });
	}

	private onUserSelected(user) {
	 this.addUser(user);
 }

 private reregisterEvents() {
	 var $delete = $(".userDelete");

	 $delete.unbind();

	 $delete.click((evnt) => {
	 var friendId = $(evnt.target).data("value");
		 this.removeUser(friendId);
	 });
	 
 }

 private isAreadyAdded(userId) {
	 var result = false;
	 this.$htmlContainer.children().each((i, elm) => {

		if (elm.id === userId) {
			result = true;
		}

	 });
	 return result;
 }

 private addUser(user) {
	 var isAdded = this.isAreadyAdded(user.friendId);
	 if (isAdded) {
		 return;
	 }

	 var canEdit = $("#isAdmin").prop("checked");
	
	 var context = {
		photoUrl: "/images/samples/sample11.jpg",//user.photoUrl,
		displayName: user.displayName,
		userId: user.friendId,
		checked: this.getChecked(canEdit)
	 }

	 var html = this.template(context);
	 this.$htmlContainer.prepend(html);

	 this.reregisterEvents();
 }

 private getChecked(checked) {
	 if (checked) {
		 return "checked";
	 }

	 return "";
 }

 private removeUser(friendId) {	
	 $("#" + friendId).remove();
 }

}