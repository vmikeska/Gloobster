module Views {
	export class WikiPermissionsView extends ViewBase {
		
		private regUserSearch() {
			this.getSearchBox("newUserCombo", (user) => {
				var data = { id: user.friendId };
				this.apiPost("WikiUserCustomPermissions", data, (created) => {
					if (created) {
						this.addUserCustom(user);
					} else {
					 var id = new Common.InfoDialog();
					 id.create("User creation unsuccessful", "Maybe user already exists ?");
					}

				});
			});
		}
			
		private initTagCombo($combo, userId) {
			var $cont = $combo.closest(".blue-form");

			var combo = new WikiSearchCombo();
			combo.initElement($combo);
			combo.selectionCallback = ($a) => {
				var articleId = $a.data("articleid");

				var data = {
					userId: userId,
					articleId: articleId
				};

				this.apiPost("WikiPermissionsArticle", data, (r) => {
					var $tag = this.getTag($a.text(), articleId, this.isMasterAdmin || this.isSuperAdmin);
					this.articleTagDelete($tag, userId);

					this.addTagToCont($cont.find(".tags"), $tag);
					//$cont.find(".tag").last().after($tag);
				});
			};
		}

		private regUserCustomDelete($cont) {
			var userId = $cont.data("userid");
			var $btn = $cont.find(".userDelete");
			$btn.click((e) => {

				var dialog = new Common.ConfirmDialog();
				dialog.create("Delete", "Do you want to remove user ?", "Cancel", "Yes", () => {
					this.apiDelete("WikiUserCustomPermissions", [["id", userId]], (r) => {
						$cont.remove();
					});
				});

			});
		}

		private articleTagDelete($tag, userId) {
			var id = $tag.attr("id");
			$tag.find(".delete").click((e) => {
				e.preventDefault();
				var dialog = new Common.ConfirmDialog();
				dialog.create("Delete", "Do you want to remove article ?", "Cancel", "Yes", () => {

					var data = [["userId", userId], ["articleId", id]];
					this.apiDelete("WikiPermissionsArticle", data, (r) => {
						$("#" + id).remove();
						dialog.hide();
					});

				});
			});
		}

		
	}
}