var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiPageView = (function (_super) {
        __extends(WikiPageView, _super);
        function WikiPageView(articleId, articleType, photoGID) {
            _super.call(this);
            this.photoGID = photoGID;
            this.articleType = articleType;
            this.articleId = articleId;
            this.resizer = new Wiki.WikiResizer(this);
            this.resizer.init();
            this.langVersion = this.getLangVersion();
            this.rating = new Wiki.Rating(articleId, this.langVersion);
            var canUpload = this.articleType === Wiki.ArticleType.City;
            this.articlePhotos = new Wiki.ArticlePhotos(articleId, canUpload);
            this.loadPhotos();
            this.reportWin = new Wiki.ReportWindow(this.langVersion, this.articleId, this);
            this.regEmptySectionsBtn();
        }
        WikiPageView.prototype.regEmptySectionsBtn = function () {
            $(".empty-button").click(function () {
                $(".cont-left").append($(".empty-blocks").children());
                $(".empty-block-all").hide();
            });
        };
        WikiPageView.prototype.loadPhotos = function () {
            this.articlePhotos.fillPhotos($("#photosCont"), 0, 9);
        };
        WikiPageView.prototype.getLangVersion = function () {
            var urlParams = window.location.pathname.split("/");
            return urlParams[2];
        };
        return WikiPageView;
    }(Views.ViewBase));
    Views.WikiPageView = WikiPageView;
})(Views || (Views = {}));
//# sourceMappingURL=WikiPageView.js.map