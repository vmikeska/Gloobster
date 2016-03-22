var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiPermissionsView = (function (_super) {
        __extends(WikiPermissionsView, _super);
        function WikiPermissionsView() {
            _super.call(this);
            this.regSaSearch();
            this.regUserSearch();
            this.initSaDelete();
            this.initArticleDelete();
            this.initTagsSearch();
            this.initUserCustomDelete();
            this.userTemplate = this.registerTemplate("userPermission-template");
        }
        WikiPermissionsView.prototype.initUserCustomDelete = function () {
            var _this = this;
            $(".userCustom").toArray().forEach(function (u) {
                _this.regUserCustomDelete($(u));
            });
        };
        WikiPermissionsView.prototype.initTagsSearch = function () {
            $(".articleCombo").toArray().forEach(function (combo) {
                var $combo = $(combo);
                var userId = $combo.closest(".blue-form").data("userid");
                //this.initTagCombo($(combo), userId);
            });
        };
        WikiPermissionsView.prototype.initArticleDelete = function () {
            var _this = this;
            $(".userCustom").find(".tag").toArray().forEach(function (tag) {
                var $tag = $(tag);
                var userId = $tag.closest(".blue-form").data("userid");
                _this.articleTagDelete($tag, userId);
            });
        };
        WikiPermissionsView.prototype.initSaDelete = function () {
            var _this = this;
            $("#saTags").find(".tag").toArray().forEach(function (tag) {
                _this.saDelete($(tag));
            });
        };
        WikiPermissionsView.prototype.regSaSearch = function () {
            var _this = this;
            this.getSearchBox("superAdminCombo", function (user) {
                var data = {
                    id: user.friendId
                };
                _this.apiPost("WikiPermissions", data, function (r) {
                    var $tag = _this.getTag(user.displayName, user.friendId);
                    _this.saDelete($tag);
                    $("#saTags").append($tag);
                });
            });
        };
        WikiPermissionsView.prototype.regUserSearch = function () {
            var _this = this;
            this.getSearchBox("newUserCombo", function (user) {
                var data = { id: user.friendId };
                _this.apiPost("WikiUserCustomPermissions", data, function (r) {
                    _this.addUserCustom(user);
                });
            });
        };
        WikiPermissionsView.prototype.addUserCustom = function (user) {
            var context = { name: user.displayName };
            var $html = $(this.userTemplate(context));
            //this.initTagCombo($html.find(".articleCombo"), user.friendId);
            this.regUserCustomDelete($html);
            $("#newUserCombo").after($html);
        };
        //private initTagCombo($combo, userId) {
        //	var $cont = $combo.closest(".blue-form");
        //	var combo = new WikiSearchCombo();
        //	combo.initElement($combo);
        //	combo.selectionCallback = ($a) => {
        //		var articleId = $a.data("articleid");
        //		var data = {
        //			userId: userId,
        //			articleId: articleId
        //		};
        //		this.apiPost("WikiPermissionsArticle", data, (r) => {
        //			var $tag = this.getTag($a.text(), articleId);
        //			this.articleTagDelete($tag, userId);
        //			this.addTagToCont($cont.find(".tags"), $tag);
        //			//$cont.find(".tag").last().after($tag);
        //		});
        //	};
        //}
        WikiPermissionsView.prototype.regUserCustomDelete = function ($cont) {
            var _this = this;
            var userId = $cont.data("userid");
            var $btn = $cont.find(".userDelete");
            $btn.click(function (e) {
                var dialog = new Common.ConfirmDialog();
                dialog.create("Delete", "Do you want to remove user ?", "Cancel", "Yes", function () {
                    _this.apiDelete("WikiUserCustomPermissions", [["id", userId]], function (r) {
                        $cont.remove();
                    });
                });
            });
        };
        WikiPermissionsView.prototype.addTagToCont = function ($tags, $tag) {
            var $tagArray = $tags.find(".tag");
            if ($tagArray.length === 0) {
                $tags.prepend($tag);
            }
            else {
                $tagArray.last().after($tag);
            }
        };
        WikiPermissionsView.prototype.saDelete = function ($tag) {
            var _this = this;
            var id = $tag.attr("id");
            $tag.find(".delete").click(function (e) {
                e.preventDefault();
                var dialog = new Common.ConfirmDialog();
                dialog.create("Delete", "Do you want to remove SA ?", "Cancel", "Yes", function () {
                    var data = [["id", id]];
                    _this.apiDelete("WikiPermissions", data, function (r) {
                        $("#" + id).remove();
                        dialog.hide();
                    });
                });
            });
        };
        WikiPermissionsView.prototype.articleTagDelete = function ($tag, userId) {
            var _this = this;
            var id = $tag.attr("id");
            $tag.find(".delete").click(function (e) {
                e.preventDefault();
                var dialog = new Common.ConfirmDialog();
                dialog.create("Delete", "Do you want to remove article ?", "Cancel", "Yes", function () {
                    var data = [["userId", userId], ["articleId", id]];
                    _this.apiDelete("WikiPermissionsArticle", data, function (r) {
                        $("#" + id).remove();
                        dialog.hide();
                    });
                });
            });
        };
        WikiPermissionsView.prototype.getTag = function (text, id) {
            return $("<span id=\"" + id + "\" class=\"tag\">" + text + "<a class=\"delete\" href=\"#\"></a></span>");
        };
        WikiPermissionsView.prototype.getSearchBox = function (id, callback) {
            var config = new Common.UserSearchConfig();
            config.elementId = id;
            config.clearAfterSearch = true;
            config.endpoint = "FriendsSearch";
            var box = new Common.UserSearchBox(config);
            box.onUserSelected = function (user) {
                callback(user);
            };
        };
        return WikiPermissionsView;
    })(Views.ViewBase);
    Views.WikiPermissionsView = WikiPermissionsView;
})(Views || (Views = {}));
//# sourceMappingURL=WikiPermissionsView.js.map