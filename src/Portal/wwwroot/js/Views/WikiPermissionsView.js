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
            this.initSaDelete();
        }
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
                    actionType: "SA",
                    id: user.friendId
                };
                _this.apiPost("WikiPermissions", data, function (r) {
                    var $tag = _this.getTag(user.displayName, user.friendId);
                    _this.saDelete($tag);
                    $("#saTags").append($tag);
                });
            });
        };
        WikiPermissionsView.prototype.saDelete = function ($tag) {
            var _this = this;
            var id = $tag.attr("id");
            $tag.find(".delete").click(function (e) {
                e.preventDefault();
                var dialog = new Common.ConfirmDialog();
                dialog.create("Delete", "Do you want to remove SA ?", "Cancel", "Yes", function () {
                    var data = [["actionType", "SA"], ["id", id]];
                    _this.apiDelete("WikiPermissions", data, function (r) {
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