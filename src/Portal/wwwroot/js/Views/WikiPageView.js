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
            this.report = new Report(articleId, this.langVersion);
            this.regContribute();
        }
        WikiPageView.prototype.regContribute = function () {
            $(".contrib-link").click(function (e) {
                e.preventDefault();
                if (Views.ViewBase.currentView.fullReg) {
                    var $t = $(e.target);
                    var $cont = $t.closest(".empty-cont");
                    if ($cont.length > 0) {
                        var sid = $cont.data("sid");
                        $(".article_rating[data-id=\"" + sid + "\"]").find(".bubble").toggle();
                    }
                }
                else {
                    Views.RegMessages.displayFullRegMessage();
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
                    text: $bubble.find(".txt").val()
                };
                var v = Views.ViewBase.currentView;
                v.apiPost("WikiReport", data, function (r) {
                    _this.toggleForm($target);
                    var id = new Common.InfoDialog();
                    id.create(v.t("ContributionThanksTitle", "jsWiki"), v.t("ContributionThanksBody", "jsWiki"));
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
                    Views.RegMessages.displayFullRegMessage();
                }
            });
        };
        return Report;
    }());
    Views.Report = Report;
})(Views || (Views = {}));
//# sourceMappingURL=WikiPageView.js.map