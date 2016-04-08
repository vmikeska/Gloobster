var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    (function (ArticleType) {
        ArticleType[ArticleType["Continent"] = 0] = "Continent";
        ArticleType[ArticleType["Country"] = 1] = "Country";
        ArticleType[ArticleType["City"] = 2] = "City";
    })(Views.ArticleType || (Views.ArticleType = {}));
    var ArticleType = Views.ArticleType;
    var WikiPageView = (function (_super) {
        __extends(WikiPageView, _super);
        function WikiPageView(articleId, articleType) {
            _super.call(this);
            this.articleType = articleType;
            this.articleId = articleId;
            this.langVersion = this.getLangVersion();
            this.photos = new WikiPhotosUser(articleId);
            this.rating = new Rating(articleId, this.langVersion);
            this.report = new Report(articleId, this.langVersion);
        }
        WikiPageView.prototype.getLangVersion = function () {
            var urlParams = window.location.pathname.split("/");
            return urlParams[2];
        };
        return WikiPageView;
    })(Views.ViewBase);
    Views.WikiPageView = WikiPageView;
    var Report = (function () {
        function Report(articleId, langVersion) {
            var _this = this;
            this.regToggleButton();
            this.articleId = articleId;
            this.langVersion = langVersion;
            this.$bubble = $(".bubble");
            this.$bubble.find(".cancel").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                _this.toggleForm($target);
            });
            this.regSend();
        }
        Report.prototype.toggleForm = function ($element) {
            $element.closest(".evaluate").toggleClass("evaluate-open");
        };
        Report.prototype.regSend = function () {
            var _this = this;
            this.$bubble.find(".send").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var $evaluate = $target.closest(".evaluate");
                var $bubble = $target.closest(".bubble");
                var data = {
                    lang: _this.langVersion,
                    articleId: _this.articleId,
                    sectionId: $evaluate.data("id"),
                    text: $bubble.find("input").val()
                };
                Views.ViewBase.currentView.apiPost("WikiReport", data, function (r) {
                    _this.toggleForm($target);
                });
            });
        };
        Report.prototype.regToggleButton = function () {
            var _this = this;
            $(".icon-flag").click(function (e) {
                e.preventDefault();
                if (Views.ViewBase.currentView.fullReg) {
                    var $target = $(e.target);
                    _this.toggleForm($target);
                }
                else {
                    RegMessages.displayFullRegMessage();
                }
            });
        };
        return Report;
    })();
    Views.Report = Report;
    var RegMessages = (function () {
        function RegMessages() {
        }
        RegMessages.displayFullRegMessage = function () {
            var id = new Common.InfoDialog();
            id.create("Full registration", "For content contribution you need to complete your registration. Either register with any social network or confirm your email.");
        };
        return RegMessages;
    })();
    Views.RegMessages = RegMessages;
    var Rating = (function () {
        function Rating(articleId, langVersion) {
            this.regRating();
            this.regRatingDD();
            this.regRatingPrice();
            this.articleId = articleId;
            this.langVersion = langVersion;
        }
        Rating.prototype.regRatingDD = function () {
            var _this = this;
            this.regRatingBase("pmBtn", "place", "WikiRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, !c.like, "pmBtn", "icon-plus", "icon-minus");
            });
        };
        Rating.prototype.regRatingPrice = function () {
            var _this = this;
            this.regRatingBase("priceBtn", "rate", "WikiPriceRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, !c.like, "priceBtn", "icon-plus", "icon-minus");
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
            this.regRatingBase("ratingBtn", "evaluate", "WikiRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, !c.like, "ratingBtn", "icon-heart", "icon-nosmile");
            });
        };
        Rating.prototype.setLikeDislike = function ($cont, like, dislike, btnClass, likeClass, dislikeClass) {
            var $btns = $cont.find("." + btnClass);
            var btns = $btns.toArray();
            btns.forEach(function (btn) {
                var $btn = $(btn);
                var isLike = $btn.data("like");
                if (isLike) {
                    var lc = likeClass + "Red";
                    $btn.removeClass(likeClass);
                    $btn.removeClass(lc);
                    $btn.addClass(like ? lc : likeClass);
                }
                else {
                    var dc = dislikeClass + "Red";
                    $btn.removeClass(dislikeClass);
                    $btn.removeClass(dc);
                    $btn.addClass(dislike ? dc : dislikeClass);
                }
            });
        };
        return Rating;
    })();
    Views.Rating = Rating;
    var WikiPhotosUser = (function () {
        function WikiPhotosUser(articleId) {
            this.articleId = articleId;
            $("#recommendPhoto").click(function (e) {
                e.preventDefault();
                if (Views.ViewBase.currentView.fullReg) {
                    $("#photosForm").show();
                    $("#recommendPhoto").hide();
                }
                else {
                    RegMessages.displayFullRegMessage();
                }
            });
            $("#photosForm .cancel").click(function (e) {
                e.preventDefault();
                $("#photosForm").hide();
                $("#recommendPhoto").show();
            });
            var $terms = $("#photosForm #cid");
            $terms.change(function (e) {
                e.preventDefault();
                var checked = $terms.prop("checked");
                if (checked) {
                    $(".photoButton").show();
                }
                else {
                    $(".photoButton").hide();
                }
            });
            this.registerPhotoUpload(this.articleId, "galleryInput");
        }
        WikiPhotosUser.prototype.registerPhotoUpload = function (articleId, inputId) {
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
                var $pb = $("#galleryProgress");
                $pb.hide();
                var id = new Common.InfoDialog();
                id.create("Photo upload", "Thank you, photo was uploaded! Will be displayed when one of our Admins validate the photo.");
            };
        };
        return WikiPhotosUser;
    })();
    Views.WikiPhotosUser = WikiPhotosUser;
})(Views || (Views = {}));
//# sourceMappingURL=WikiPageView.js.map