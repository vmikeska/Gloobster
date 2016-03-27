module Views {
	export class WikiPermissionsView extends ViewBase {

		private userTemplate;

		constructor() {
			super();

			this.regSaSearch();
			this.regUserSearch();

			this.initSaDelete();
			this.initArticleDelete();
			this.initTagsSearch();

			this.initUserCustomDelete();

			this.userTemplate = this.registerTemplate("userPermission-template");
		}

		private initUserCustomDelete() {
			$(".userCustom").toArray().forEach((u) => {
				this.regUserCustomDelete($(u));
			});
		}

		private initTagsSearch() {
			$(".articleCombo").toArray().forEach((combo) => {
				var $combo = $(combo);
				var userId = $combo.closest(".blue-form").data("userid");
				this.initTagCombo($(combo), userId);
			});
		}

		private initArticleDelete() {
			$(".userCustom").find(".tag").toArray().forEach((tag) => {
				var $tag = $(tag);
				var userId = $tag.closest(".blue-form").data("userid");
				this.articleTagDelete($tag, userId);
			});
		}

		private initSaDelete() {
			$("#saTags").find(".tag").toArray().forEach((tag) => {
				this.saDelete($(tag));
			});
		}

		private regSaSearch() {
			this.getSearchBox("superAdminCombo", (user) => {
				var data = {
					id: user.friendId
				};
				this.apiPost("WikiPermissions", data, (r) => {
					var $tag = this.getTag(user.displayName, user.friendId);
					this.saDelete($tag);
					$("#saTags").append($tag);
				});
			});
		}

		private regUserSearch() {
			this.getSearchBox("newUserCombo", (user) => {
				var data = { id: user.friendId };
				this.apiPost("WikiUserCustomPermissions", data, (r) => {
					this.addUserCustom(user);
				});
			});
		}

		private addUserCustom(user) {
			var context = { name: user.displayName };
			var $html = $(this.userTemplate(context));
			this.initTagCombo($html.find(".articleCombo"), user.friendId);
			this.regUserCustomDelete($html);
			$("#newUserCombo").after($html);
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
					var $tag = this.getTag($a.text(), articleId);
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

		private addTagToCont($tags, $tag) {
			var $tagArray = $tags.find(".tag");
			if ($tagArray.length === 0) {
				$tags.prepend($tag);
			} else {
				$tagArray.last().after($tag);
			}
		}

		private saDelete($tag) {
			var id = $tag.attr("id");
			$tag.find(".delete").click((e) => {
				e.preventDefault();
				var dialog = new Common.ConfirmDialog();
				dialog.create("Delete", "Do you want to remove SA ?", "Cancel", "Yes", () => {

					var data = [["id", id]];
					this.apiDelete("WikiPermissions", data, (r) => {
						$("#" + id).remove();
						dialog.hide();
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