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
            this.results = [];
        }
        QuizDetailView.prototype.init = function () {
            this.regArrows();
            this.regOptions();
        };
        QuizDetailView.prototype.regOptions = function () {
            var _this = this;
            $(".option-cont").click(function (e) {
                var $t = $(e.target);
                var itemNo = $t.closest(".quiz-item").data("no");
                var optNo = $t.data("no");
                var result = _this.getOptionRes(itemNo);
                result.voted = optNo;
                _this.onChange();
                _this.move(true);
                _this.setOptions(_this.currentItem);
            });
        };
        QuizDetailView.prototype.getOptionRes = function (itemNo) {
            var result = _.find(this.results, { itemNo: itemNo });
            if (!result) {
                result = { itemNo: itemNo, voted: null };
                this.results.push(result);
            }
            return result;
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
            alert(score);
        };
        QuizDetailView.prototype.countScore = function () {
            var correct = 0;
            for (var act = 1; act <= this.maxItems; act++) {
                var res = this.getOptionRes(act);
                var $i = this.getItemByNo(act);
                var ok = (res.voted === $i.data("c"));
                if (ok) {
                    correct++;
                }
            }
            return correct;
        };
        QuizDetailView.prototype.allVoted = function () {
            var isFull = true;
            for (var act = 1; act <= this.maxItems; act++) {
                var res = this.getOptionRes(act);
                if (!res.voted) {
                    isFull = false;
                }
            }
            return isFull;
        };
        QuizDetailView.prototype.setOptions = function (no) {
            var result = this.getOptionRes(no);
            if (!result.voted) {
                return;
            }
            var $i = this.getItemByNo(no);
            var $o = $i.find(".option-cont[data-no=\"" + result.voted + "\"]");
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