var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiPageView = (function (_super) {
        __extends(WikiPageView, _super);
        function WikiPageView() {
            _super.call(this);
            this.isAdminMode = false;
            this.$adminMode = $("#adminMode");
            this.regAdminMode();
            this.langVersion = this.getLangVersion();
            this.blockTemplate = this.registerTemplate("blockEdit-template");
            this.regRating();
        }
        WikiPageView.prototype.regRating = function () {
            var _this = this;
            $(".icon-flag").click(function (e) {
                e.preventDefault();
                $(e.target).closest('.evaluate').toggleClass('evaluate-open');
            });
            $(".icon-heart").click(function (e) {
                e.preventDefault();
                var $btn = $(e.target);
                var $cont = $btn.closest(".evaluate");
                var id = $cont.data("id");
                var data = {
                    articleId: _this.articleId,
                    sectionId: id,
                    language: _this.langVersion,
                    like: true
                };
                _this.apiPut("WikiRating", data, function (r) {
                    //$(`#edit_${id}`).remove();
                    //$(`#text_${id}`).text(data.newText);
                    //$(`#editSection_${id}`).show();
                });
            });
        };
        WikiPageView.prototype.regAdminMode = function () {
            var _this = this;
            this.$adminMode.change(function () {
                _this.isAdminMode = _this.$adminMode.prop("checked");
                _this.onAdminModeChanged();
            });
        };
        WikiPageView.prototype.getLangVersion = function () {
            var urlParams = window.location.pathname.split("/");
            return urlParams[2];
        };
        WikiPageView.prototype.onAdminModeChanged = function () {
            if (this.isAdminMode) {
                this.generateEdits();
            }
            else {
                this.destroyEdits();
            }
        };
        WikiPageView.prototype.destroyEdits = function () {
            $(".editSection").remove();
        };
        WikiPageView.prototype.generateEdits = function () {
            var _this = this;
            var adminCases = $(".adminCase").toArray();
            adminCases.forEach(function (item) {
                var $case = $(item);
                var id = $case.data("id");
                var html = "<a href=\"#\" id=\"editSection_" + id + "\" class=\"editSection\" data-id=\"" + id + "\">edit</a>";
                $case.append(html);
            });
            $(".editSection").click(function (e) {
                e.preventDefault();
                var id = $(e.target).data("id");
                var $p = $("#text_" + id);
                _this.createEditWindow($p, id);
                $(e.target).hide();
            });
        };
        WikiPageView.prototype.createEditWindow = function ($p, sectionId) {
            var _this = this;
            var scope = {
                text: $p.html(),
                id: sectionId
            };
            var $html = $(this.blockTemplate(scope));
            $html.find(".cancel").click(function (e) {
                var $btn = $(e.target);
                var id = $btn.data("id");
                $("#edit_" + id).remove();
                $("#editSection_" + id).show();
            });
            $html.find(".save").click(function (e) {
                var $btn = $(e.target);
                var id = $btn.data("id");
                var data = {
                    articleId: _this.articleId,
                    sectionId: id,
                    language: _this.langVersion,
                    newText: $("#edit_" + id).find(".editTxt").val()
                };
                _this.apiPut("WikiUpdate", data, function (r) {
                    $("#edit_" + id).remove();
                    $("#text_" + id).text(data.newText);
                    $("#editSection_" + id).show();
                });
            });
            $p.prepend($html);
        };
        return WikiPageView;
    })(Views.ViewBase);
    Views.WikiPageView = WikiPageView;
})(Views || (Views = {}));
//# sourceMappingURL=WikiPageView.js.map