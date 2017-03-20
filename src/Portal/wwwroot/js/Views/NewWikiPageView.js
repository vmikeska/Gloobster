var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var NewWikiPageView = (function (_super) {
        __extends(NewWikiPageView, _super);
        function NewWikiPageView(articleId, articleType) {
            _super.call(this);
            this.articleType = articleType;
            this.articleId = articleId;
            this.langVersion = this.getLangVersion();
            this.rating = new Rating(articleId, this.langVersion);
            this.articlePhotos = new ArticlePhotos(articleId);
            this.loadPhotos();
        }
        NewWikiPageView.prototype.loadPhotos = function () {
            this.articlePhotos.fillPhotos($("#photosCont"), 0, 9);
        };
        NewWikiPageView.prototype.getLangVersion = function () {
            var urlParams = window.location.pathname.split("/");
            return urlParams[2];
        };
        return NewWikiPageView;
    }(Views.ViewBase));
    Views.NewWikiPageView = NewWikiPageView;
    var ArticlePhotos = (function () {
        function ArticlePhotos(articleId) {
            this.articleId = articleId;
            this.registerPhotoUpload(this.articleId, "addUserPhoto");
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
                    var $img = $("<img src=\"data:image/jpeg;base64," + p + "\" />");
                    $cont.append($img);
                });
            });
        };
        ArticlePhotos.prototype.registerPhotoUpload = function (articleId, inputId) {
            var config = new Common.FileUploadConfig();
            config.inputId = inputId;
            config.endpoint = "WikiPhotoGallery";
            var pu = new Common.FileUpload(config);
            pu.customId = articleId;
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
                ud.destroy();
            };
        };
        return ArticlePhotos;
    }());
    Views.ArticlePhotos = ArticlePhotos;
    var Rating = (function () {
        function Rating(articleId, langVersion) {
            this.regRating();
            this.regRatingDD();
            this.regRatingPrice();
            this.articleId = articleId;
            this.langVersion = langVersion;
        }
        Rating.prototype.getRatingDesign = function (rating) {
            var res = {
                rstr: rating,
                cls: ""
            };
            if (rating > 0) {
                res.rstr = "+" + rating;
                res.cls = "plus";
            }
            else {
                res.cls = "minus";
            }
            return res;
        };
        Rating.prototype.regRatingDD = function () {
            var _this = this;
            this.regRatingBase("pmBtn", "item", "WikiRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, "pmBtn");
            });
        };
        Rating.prototype.regRatingPrice = function () {
            var _this = this;
            this.regRatingBase("priceBtn", "rate", "WikiPriceRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, "priceBtn");
                c.$cont.prev().find(".price").text(c.res.toFixed(2));
            });
        };
        Rating.prototype.regRatingBase = function (btnClass, contClass, endpoint, callback) {
            var _this = this;
            $("." + btnClass).click(function (e) {
                e.preventDefault();
                var $btn = $(e.target);
                var like = $btn.data("like");
                var $cont = $btn.closest("." + contClass);
                var id = $cont.data("id");
                var data = {
                    articleId: _this.articleId,
                    sectionId: id,
                    language: _this.langVersion,
                    like: like
                };
                if (Views.ViewBase.currentView.fullReg) {
                    Views.ViewBase.currentView.apiPut(endpoint, data, function (r) {
                        callback({ $cont: $cont, like: like, res: r });
                    });
                }
                else {
                    RegMessages.displayFullRegMessage();
                }
            });
        };
        Rating.prototype.regRating = function () {
            var _this = this;
            this.regRatingBase("ratingBtn", "article-rating", "WikiRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, "ratingBtn");
                if (c.res != null) {
                    var $r = c.$cont.find(".score");
                    $r.removeClass("plus").removeClass("minus");
                    var d = _this.getRatingDesign(c.res);
                    $r.text(d.rstr);
                    $r.addClass(d.cls);
                }
            });
        };
        Rating.prototype.setLikeDislike = function ($cont, state, btnClass) {
            var $btns = $cont.find("." + btnClass);
            var btns = $btns.toArray();
            $btns.removeClass("active");
            btns.forEach(function (btn) {
                var $btn = $(btn);
                var isLike = $btn.data("like");
                if (isLike && state) {
                    $btn.addClass("active");
                }
                if (!isLike && !state) {
                    $btn.addClass("active");
                }
            });
        };
        return Rating;
    }());
    Views.Rating = Rating;
    var RegMessages = (function () {
        function RegMessages() {
        }
        RegMessages.displayFullRegMessage = function () {
            var id = new Common.InfoDialog();
            var v = Views.ViewBase.currentView;
            id.create(v.t("FullRegTitle", "jsWiki"), v.t("FullRegBody", "jsWiki"));
        };
        return RegMessages;
    }());
    Views.RegMessages = RegMessages;
})(Views || (Views = {}));
//# sourceMappingURL=NewWikiPageView.js.map