var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var DetailView = (function (_super) {
        __extends(DetailView, _super);
        function DetailView() {
            _super.call(this);
            this.itemTmp = Views.ViewBase.currentView.registerTemplate("user-rating-template");
            this.initRating();
            this.transLangs();
            this.transCharact();
        }
        DetailView.prototype.transCharact = function () {
            var $cs = $("#characts");
            if ($cs.length > 0) {
                var chars = TravelB.TravelBUtils.interestsDB();
                var csa = $cs.find(".tag").toArray();
                csa.forEach(function (l) {
                    var $l = $(l);
                    var code = parseInt($l.html());
                    var char = _.find(chars, function (li) {
                        return li.id === code;
                    });
                    if (char) {
                        $l.html(char.text);
                    }
                    else {
                        $l.hide();
                    }
                });
            }
        };
        DetailView.prototype.transLangs = function () {
            var $ls = $("#langs");
            if ($ls.length > 0) {
                var langs = TravelB.TravelBUtils.langsDB();
                var lsa = $ls.find(".ltag").toArray();
                lsa.forEach(function (l) {
                    var $l = $(l);
                    var code = $l.html();
                    var lang = _.find(langs, function (li) {
                        return li.id === code;
                    });
                    if (lang) {
                        $l.html(lang.text);
                    }
                    else {
                        $l.hide();
                    }
                });
            }
        };
        DetailView.prototype.initRating = function () {
            var _this = this;
            $("#sendNewText").click(function (e) {
                e.preventDefault();
                var data = {
                    targetUserId: $("#userId").val(),
                    text: $("#newText").val()
                };
                _this.apiPost("UserRating", data, function (r) {
                    $(".ratings .empty").hide();
                    var context = {
                        userId: r.userId,
                        name: r.name,
                        text: r.text
                    };
                    var $h = $(_this.itemTmp(context));
                    $(".ratings .items").append($h);
                    $("#newText").val("");
                });
            });
            $(".rating-delete").click(function (e) {
                var $t = $(e.target);
                var $c = $t.closest(".item");
                var id = $c.data("id");
                var cd = new Common.ConfirmDialog();
                cd.create(_this.t("RatingDelTitle", "jsUserDetail"), _this.t("RatingDelBody", "jsUserDetail"), _this.t("Cancel", "jsLayout"), _this.t("Delete", "jsLayout"), function () {
                    _this.apiDelete("UserRating", [["id", id]], function () {
                        $(".item[data-id=\"" + id + "\"]").remove();
                    });
                });
            });
        };
        return DetailView;
    }(Views.ViewBase));
    Views.DetailView = DetailView;
})(Views || (Views = {}));
//# sourceMappingURL=DetailView.js.map