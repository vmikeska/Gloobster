module Views {
	export class InviteDialogView {

	 private userSearchBox: Common.UserSearchBox;
		private template: any;
		private $htmlContainer: any;

		constructor() {
		 
			var config = new Common.UserSearchConfig();
			config.elementId = "friends";
			config.clearAfterSearch = true;
			config.endpoint = "FriendsSearch";

			this.$htmlContainer = $("#inviteFriendsCont");

			this.userSearchBox = new Common.UserSearchBox(config);
			this.userSearchBox.onUserSelected = (user) => this.onUserSelected(user);

			var source = $("#inviteDialogUser-template").html();
			this.template = Handlebars.compile(source);

			$("#invite").click(() => this.invite());
		}

		private invite() {
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
				tripId: ViewBase.currentView["trip"].tripId,
				users: users		
			}

			ViewBase.currentView.apiPost("TripParticipants", data, r => {

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
				photoUrl: "/images/samples/sample11.jpg", //user.photoUrl,
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


}