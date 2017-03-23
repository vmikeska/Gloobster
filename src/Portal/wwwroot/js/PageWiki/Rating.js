var Wiki;
(function (Wiki) {
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
    Wiki.Rating = Rating;
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
    Wiki.RegMessages = RegMessages;
})(Wiki || (Wiki = {}));
//# sourceMappingURL=Rating.js.map