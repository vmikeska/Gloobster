module Views {
	export class WikiPermissionsView extends ViewBase {
		
	 constructor() {
		 super();

		 this.regSaSearch();

		 this.initSaDelete();

	 }

	 private initSaDelete() {
		 $("#saTags").find(".tag").toArray().forEach((tag) => {
			 this.saDelete($(tag));
		 });
	 }

		private regSaSearch() {
			this.getSearchBox("superAdminCombo", (user) => {
				var data = {
					actionType: "SA",
					id: user.friendId
				};
				this.apiPost("WikiPermissions", data, (r) => {
					var $tag = this.getTag(user.displayName, user.friendId);
					this.saDelete($tag);
					$("#saTags").append($tag);
				});
			});
		}

		private saDelete($tag) {
			var id = $tag.attr("id");
		 $tag.find(".delete").click((e) => {
			 e.preventDefault();
			 var dialog = new Common.ConfirmDialog();
			 dialog.create("Delete", "Do you want to remove SA ?", "Cancel", "Yes", () => {

				var data = [["actionType", "SA"], ["id", id]];
				this.apiDelete("WikiPermissions", data, (r) => {
				 $("#" + id).remove();
					dialog.hide();
				}); 

			 });			 
			});
		}

		private getTag(text, id) {
		 return $(`<span id="${id}" class="tag">${text}<a class="delete" href="#"></a></span>`);
	 }

	 private getSearchBox(id, callback) {
		var config = new Common.UserSearchConfig();
		config.elementId = id;
		config.clearAfterSearch = true;
		config.endpoint = "FriendsSearch";
		var box = new Common.UserSearchBox(config);
		box.onUserSelected = (user) => {
			callback(user);
		};
	 }

	}
}