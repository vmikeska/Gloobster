var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var QuizDetailView = (function (_super) {
        __extends(QuizDetailView, _super);
        function QuizDetailView() {
            _super.call(this);
            this.currentItem = 1;
            this.maxItems = 10;
        }
        QuizDetailView.prototype.init = function () {
            this.regArrows();
            this.regOptions();
        };
        QuizDetailView.prototype.regOptions = function () {
            var _this = this;
            $(".option-cont").click(function (e) {
                var $t = $(e.delegateTarget);
                var $i = $t.closest(".quiz-item");
                var optNo = $t.data("no");
                $i.data("v", optNo);
                _this.onChange();
                _this.move(true);
                _this.setOptions(_this.currentItem);
            });
        };
        QuizDetailView.prototype.regArrows = function () {
            var _this = this;
            var $buttons = $(".buttons");
            $buttons.find(".left").click(function (e) {
                _this.move(false);
            });
            $buttons.find(".right").click(function (e) {
                _this.move(true);
            });
        };
        QuizDetailView.prototype.move = function (forward) {
            if ((this.currentItem === 1 && !forward) || (this.currentItem === this.maxItems && forward)) {
                return;
            }
            if (forward) {
                this.currentItem++;
            }
            else {
                this.currentItem--;
            }
            for (var act = 1; act <= this.maxItems; act++) {
                var $i = $(".quiz-item[data-no=\"" + act + "\"]");
                var show = this.currentItem === act;
                if (show) {
                    $i.fadeIn();
                }
                else {
                    $i.hide();
                }
            }
            this.setOptions(this.currentItem);
            $(".displayer .curr-page").html(this.currentItem);
        };
        QuizDetailView.prototype.onChange = function () {
            if (this.allVoted()) {
                this.showFinished();
            }
        };
        QuizDetailView.prototype.showFinished = function () {
            var score = this.countScore();
            var t = this.registerTemplate("quiz-result-tmp");
            var context = {
                titleUrl: $("#titleUrl").val(),
                score: score
            };
            var $t = $(t(context));
            $("#quizCont").html($t);
        };
        QuizDetailView.prototype.countScore = function () {
            var correct = 0;
            var $items = $(".quiz-item");
            $items.each(function (i, item) {
                var $item = $(item);
                var v = $item.data("v");
                var c = $item.data("c");
                if (c === v) {
                    correct++;
                }
            });
            return correct;
        };
        QuizDetailView.prototype.allVoted = function () {
            var isFull = true;
            var $items = $(".quiz-item");
            $items.each(function (i, item) {
                var $item = $(item);
                var v = $item.data("v");
                if (!v) {
                    isFull = false;
                }
            });
            return isFull;
        };
        QuizDetailView.prototype.setOptions = function (no) {
            var $i = this.getItemByNo(no);
            var v = $i.data("v");
            if (!v) {
                return;
            }
            var $o = $i.find(".option-cont[data-no=\"" + v + "\"]");
            $i.find(".option-cont").removeClass("active");
            $o.addClass("active");
        };
        QuizDetailView.prototype.getItemByNo = function (no) {
            return $(".quiz-item[data-no=\"" + no + "\"]");
        };
        return QuizDetailView;
    }(Views.ViewBase));
    Views.QuizDetailView = QuizDetailView;
})(Views || (Views = {}));
//# sourceMappingURL=QuizDetailView.js.map