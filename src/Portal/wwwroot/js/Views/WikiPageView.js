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
            this.regContribute();
        }
        WikiPageView.prototype.regContribute = function () {
            $(".contrib-link").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var $cont = $t.closest(".empty-cont");
                if ($cont.length > 0) {
                    var sid = $cont.data("sid");
                    $(".article_rating[data-id=\"" + sid + "\"]").find(".bubble").toggle();
                }
            });
        };
        WikiPageView.prototype.getLangVersion = function () {
            var urlParams = window.location.pathname.split("/");
            return urlParams[2];
        };
        return WikiPageView;
    }(Views.ViewBase));
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
            $element.closest(".article_rating").find(".bubble").toggle();
        };
        Report.prototype.regSend = function () {
            var _this = this;
            this.$bubble.find(".send").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var $frame = $target.closest(".article_rating");
                var $bubble = $target.closest(".bubble");
                var data = {
                    lang: _this.langVersion,
                    articleId: _this.articleId,
                    sectionId: $frame.data("id"),
                    text: $bubble.find("input").val()
                };
                Views.ViewBase.currentView.apiPost("WikiReport", data, function (r) {
                    _this.toggleForm($target);
                });
            });
        };
        Report.prototype.regToggleButton = function () {
            var _this = this;
            $(".icon-edit-pencil").click(function (e) {
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
    }());
    Views.Report = Report;
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
            this.regRatingBase("ratingBtn", "article_rating", "WikiRating", function (c) {
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
                var v = Views.ViewBase.currentView;
                id.create(v.t("UploadTitle", "jsWiki"), v.t("UploadBody", "jsWiki"));
            };
        };
        return WikiPhotosUser;
    }());
    Views.WikiPhotosUser = WikiPhotosUser;
})(Views || (Views = {}));
//# sourceMappingURL=WikiPageView.js.map