var Wiki;
(function (Wiki) {
    var ArticlePhotos = (function () {
        function ArticlePhotos(articleId, canUpload) {
            var _this = this;
            this.articleId = articleId;
            $("#openPhotoDialog").click(function (e) {
                _this.showPhotoUploadDialog(null);
            });
            if (canUpload) {
                $("#openPhotoDialog").removeClass("hidden");
            }
        }
        ArticlePhotos.prototype.getThumbs = function (layoutSize, photosLimit, callback) {
            var data = [["articleId", this.articleId], ["layoutSize", layoutSize.toString()], ["photosLimit", photosLimit.toString()]];
            Views.ViewBase.currentView.apiGet("WikiPhotoThumbnails", data, function (photos) {
                callback(photos);
            });
        };
        ArticlePhotos.prototype.fillPhotos = function ($cont, layoutSize, photosLimit) {
            this.getThumbs(layoutSize, photosLimit, function (photos) {
                photos.forEach(function (p) {
                    var link = "/Wiki/ArticlePhoto?photoId=" + p.photoId + "&articleId=" + p.articleId;
                    var $img = $("<a class=\"photo-link\" href=\"" + link + "\" target=\"_blank\"><img src=\"data:image/jpeg;base64," + p.data + "\" /></a>");
                    $cont.append($img);
                });
            });
        };
        ArticlePhotos.prototype.showPhotoUploadDialog = function (sectionId) {
            var cd = new Common.CustomDialog();
            var v = Views.ViewBase.currentView;
            var t = v.registerTemplate("photo-upload-dlg-template");
            var $t = $(t());
            cd.init($t, v.t("UploadAPhoto", "jsWiki"));
            cd.addBtn("Close", "yellow-orange", function () {
                cd.close();
            });
            this.registerPhotoUpload(this.articleId, "addUserPhoto", sectionId, function () {
                cd.close();
            });
        };
        ArticlePhotos.prototype.registerPhotoUpload = function (articleId, inputId, sectionId, callback) {
            var config = new Common.FileUploadConfig();
            config.inputId = inputId;
            config.endpoint = "WikiPhotoGallery";
            var pu = new Common.FileUpload(config);
            pu.customId = articleId;
            if (sectionId) {
                pu.customId += "," + sectionId;
            }
            var ud = null;
            pu.onProgressChanged = function (percent) {
                if (ud === null) {
                    ud = new Common.UploadDialog();
                    ud.create();
                }
                ud.update(percent);
            };
            pu.onUploadFinished = function (file, fileId) {
                var $pb = $("#galleryProgress");
                $pb.hide();
                var id = new Common.InfoDialog();
                var v = Views.ViewBase.currentView;
                id.create(v.t("UploadTitle", "jsWiki"), v.t("UploadBody", "jsWiki"));
                if (ud) {
                    ud.destroy();
                }
                callback();
            };
        };
        return ArticlePhotos;
    }());
    Wiki.ArticlePhotos = ArticlePhotos;
})(Wiki || (Wiki = {}));
//# sourceMappingURL=ArticlePhotos.js.map