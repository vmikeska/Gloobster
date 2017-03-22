var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiAdminPageView = (function (_super) {
        __extends(WikiAdminPageView, _super);
        function WikiAdminPageView(articleId, articleType) {
            _super.call(this, articleId, articleType);
            this.isAdminMode = false;
            this.linksAdmin = new Views.LinksAdmin(articleId);
            this.photoAdmin = new PhotoAdmin(articleId);
            this.photosAdmin = new PhotosAdmin(articleId);
            this.$adminMode = $("#adminMode");
            this.regAdminMode();
        }
        WikiAdminPageView.prototype.regAdminMode = function () {
            var _this = this;
            this.$adminMode.change(function () {
                _this.isAdminMode = _this.$adminMode.prop("checked");
                _this.onAdminModeChanged();
            });
        };
        WikiAdminPageView.prototype.onAdminModeChanged = function () {
            if (this.isAdminMode) {
                this.generateBlocks();
            }
            else {
                this.destroyBlocks();
            }
        };
        WikiAdminPageView.prototype.generateBlocks = function () {
            var adminBlocks = $(".adminBlock").toArray();
            adminBlocks.forEach(function (block) {
                var $block = $(block);
                var id = $block.data("id");
                var adminType = $block.data("at");
            });
            this.photoAdmin.generateAdmin();
            if (this.articleType === Views.ArticleType.City) {
                this.photosAdmin.createAdmin();
            }
        };
        WikiAdminPageView.prototype.destroyBlocks = function () {
            $(".editSection").remove();
            this.photoAdmin.clean();
            if (this.articleType === Views.ArticleType.City) {
                this.photosAdmin.clean();
            }
        };
        return WikiAdminPageView;
    }(Views.WikiPageView));
    Views.WikiAdminPageView = WikiAdminPageView;
    var PhotosAdmin = (function () {
        function PhotosAdmin(articleId) {
            this.articleId = articleId;
            this.$cont = $("#photos");
        }
        PhotosAdmin.prototype.createAdmin = function () {
            this.refreshPhotos(this.articleId, true);
        };
        PhotosAdmin.prototype.clean = function () {
            this.refreshPhotos(this.articleId, false);
        };
        PhotosAdmin.prototype.regDelPhoto = function () {
            var _this = this;
            this.$cont.find(".delete").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var confirmDialog = new Common.ConfirmDialog();
                confirmDialog.create("Delete", "Do you want to permanently delete this photo ?", "Cancel", "Ok", function ($dialog) {
                    Views.ViewBase.currentView.apiDelete("WikiPhotoGallery", [["articleId", $target.data("ai")], ["photoId", $target.data("pi")]], function (r) {
                        $dialog.remove();
                        _this.refreshPhotos(_this.articleId, true);
                    });
                });
            });
        };
        PhotosAdmin.prototype.regConfPhoto = function () {
            var _this = this;
            this.$cont.find(".confirm").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var data = {
                    articleId: $target.data("ai"),
                    photoId: $target.data("pi")
                };
                Views.ViewBase.currentView.apiPut("WikiPhotoGallery", data, function (r) {
                    _this.refreshPhotos(_this.articleId, true);
                });
            });
        };
        PhotosAdmin.prototype.refreshPhotos = function (id, admin) {
            var _this = this;
            var request = new Common.RequestSender("/Wiki/ArticlePhotos", null, false);
            request.params = [["id", id], ["admin", admin.toString()]];
            request.onSuccess = function (html) {
                _this.$cont.html(html);
                var $photoBtn = $("#duCont");
                if (admin) {
                    _this.regConfPhoto();
                    _this.regDelPhoto();
                    _this.registerPhotoUpload(_this.articleId, "galleryPhotoInput");
                    $photoBtn.show();
                }
            };
            request.onError = function (response) { $("#photos").html("Error"); };
            request.sendGet();
        };
        PhotosAdmin.prototype.registerPhotoUpload = function (articleId, inputId) {
            var _this = this;
            var config = new Common.FileUploadConfig();
            config.inputId = inputId;
            config.endpoint = "WikiPhotoGallery";
            var picUpload = new Common.FileUpload(config);
            picUpload.customId = articleId;
            picUpload.onProgressChanged = function (percent) {
                var $pb = $("#galleryProgress");
                $pb.show();
                var pt = percent + "%";
                $(".progress").css("width", pt);
                $pb.find("span").text(pt);
            };
            picUpload.onUploadFinished = function (file, fileId) {
                _this.refreshPhotos(_this.articleId, true);
            };
        };
        return PhotosAdmin;
    }());
    Views.PhotosAdmin = PhotosAdmin;
    var PhotoAdmin = (function () {
        function PhotoAdmin(articleId) {
            this.articleId = articleId;
            this.buttonTemplate = Views.ViewBase.currentView.registerTemplate("photoEdit-template");
        }
        PhotoAdmin.prototype.generateAdmin = function () {
            var $html = $(this.buttonTemplate());
            $(".titlePhoto").before($html);
            this.registerPhotoUpload(this.articleId, "titlePhotoInput");
        };
        PhotoAdmin.prototype.clean = function () {
            $(".photo-button").remove();
        };
        PhotoAdmin.prototype.registerPhotoUpload = function (articleId, inputId) {
            var _this = this;
            var config = new Common.FileUploadConfig();
            config.inputId = inputId;
            config.endpoint = "WikiTitlePhoto";
            var picUpload = new Common.FileUpload(config);
            picUpload.customId = articleId;
            picUpload.onProgressChanged = function (percent) {
            };
            picUpload.onUploadFinished = function (file, files) {
                var d = new Date();
                $(".titlePhoto img").attr("src", "/wiki/ArticleTitlePhoto/" + _this.articleId + "?d=" + d.getDate());
            };
        };
        return PhotoAdmin;
    }());
    Views.PhotoAdmin = PhotoAdmin;
})(Views || (Views = {}));
//# sourceMappingURL=WikiAdminPageView.js.map