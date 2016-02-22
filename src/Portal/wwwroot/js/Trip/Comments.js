var Trip;
(function (Trip) {
    var Comments = (function () {
        function Comments() {
            var source = $("#comment-template").html();
            this.template = Handlebars.compile(source);
        }
        Comments.prototype.generateComments = function () {
            var _this = this;
            var html = "";
            if (!this.comments) {
                return "";
            }
            this.comments.forEach(function (comment) {
                html += _this.generateComment(comment);
            });
            return html;
        };
        Comments.prototype.postComment = function (tripId) {
            var _this = this;
            var $input = $("#commentInput");
            var text = $input.val();
            var request = { text: text, tripId: tripId };
            Views.ViewBase.currentView.apiPost("tripComment", request, function (response) {
                _this.comments = response.comments;
                _this.users = response.users;
                _this.displayComments();
            });
            $input.val("");
        };
        Comments.prototype.displayComments = function () {
            var commentsHtml = this.generateComments();
            $("#commentsContainer").html(commentsHtml);
        };
        Comments.prototype.generateComment = function (comment) {
            var context = this.addUserData(comment);
            var html = this.template(context);
            return html;
        };
        Comments.prototype.addUserData = function (comment) {
            var user = this.getUserById(comment.userId);
            var postDate = new Date(comment.postDate);
            comment["displayDate"] = postDate.getDate() + "." + postDate.getMonth() + "." + postDate.getFullYear() + " (" + postDate.getHours() + ":" + postDate.getMinutes() + ")";
            comment["displayName"] = user.displayName;
            comment["photoUrl"] = "/PortalUser/ProfilePicture_s/" + user.id;
            comment["id"] = user.id;
            return comment;
        };
        Comments.prototype.getUserById = function (id) {
            var user = _.find(this.users, function (user) {
                return user.id === id;
            });
            return user;
        };
        return Comments;
    })();
    Trip.Comments = Comments;
})(Trip || (Trip = {}));
//# sourceMappingURL=Comments.js.map