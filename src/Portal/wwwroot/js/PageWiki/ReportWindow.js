var Wiki;
(function (Wiki) {
    var ReportWindow = (function () {
        function ReportWindow(langVersion, articleId, v) {
            this.langVersion = langVersion;
            this.articleId = articleId;
            this.v = v;
            this.registerBtnEvent();
        }
        ReportWindow.prototype.registerBtnEvent = function () {
            var _this = this;
            $(".article-rating-all .report-btn").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var $p = $t.closest(".article-rating");
                var sectionId = $p.data("id");
                _this.createWindow(sectionId);
            });
            $(".empty-block .contrib-link").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var $p = $t.closest(".empty-block");
                var sectionId = $p.data("sid");
                _this.createWindow(sectionId);
            });
        };
        ReportWindow.prototype.createWindow = function (sectionId) {
            var _this = this;
            var cd = new Common.CustomDialog();
            var t = this.v.registerTemplate("block-report-tmp");
            var $html = $(t());
            $html.find("#uploadSectionPhoto").click(function (e) {
                e.preventDefault();
                _this.v.articlePhotos.showPhotoUploadDialog(sectionId);
            });
            cd.init($html, this.v.t("ReportText", "jsWiki"));
            cd.addBtn(this.v.t("Cancel", "jsLayout"), "red-orange", function () {
                cd.close();
            });
            cd.addBtn(this.v.t("ReportSend", "jsWiki"), "green-orange", function () {
                var txt = $html.find(".txt-area").val();
                _this.sendReport(sectionId, txt, function () {
                    cd.close();
                });
            });
        };
        ReportWindow.prototype.sendReport = function (sectionId, txt, callback) {
            var _this = this;
            var data = {
                lang: this.langVersion,
                articleId: this.articleId,
                sectionId: sectionId,
                text: txt
            };
            this.v.apiPost("WikiReport", data, function (r) {
                var id = new Common.InfoDialog();
                id.create(_this.v.t("ContributionThanksTitle", "jsWiki"), _this.v.t("ContributionThanksBody", "jsWiki"));
                callback();
            });
        };
        return ReportWindow;
    }());
    Wiki.ReportWindow = ReportWindow;
})(Wiki || (Wiki = {}));
//# sourceMappingURL=ReportWindow.js.map