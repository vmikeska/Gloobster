var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var QuizAdminPage = (function (_super) {
        __extends(QuizAdminPage, _super);
        function QuizAdminPage(v) {
            _super.call(this, v);
            this.questionsCnt = 10;
        }
        QuizAdminPage.prototype.createCustom = function () {
            this.currentLang = "en";
            this.generateList();
            this.registerListActions();
        };
        QuizAdminPage.prototype.registerListActions = function () {
            var _this = this;
            this.$cont.find("#addNewQuiz").click(function (e) {
                e.preventDefault();
                var data2 = [["getEmptyNumber", "true"]];
                _this.v.apiGet("Quiz", data2, function (avaiableNo) {
                    _this.currentNo = avaiableNo;
                    _this.createDetail(null);
                    _this.registerDetialActions();
                });
            });
        };
        QuizAdminPage.prototype.registerDetialActions = function () {
            var _this = this;
            this.$cont.find("#btnSave").click(function (e) {
                e.preventDefault();
                _this.save();
            });
            this.$cont.find("#btnCancel").click(function (e) {
                e.preventDefault();
                _this.generateList();
            });
            this.$cont.find(".correct-cb").click(function (e) {
                var $t = $(e.target);
                var $i = $t.closest(".item");
                var $cbs = $i.find(".correct-cb");
                $cbs.prop("checked", false);
                $t.prop("checked", true);
            });
        };
        QuizAdminPage.prototype.save = function () {
            var _this = this;
            var $d = this.$cont.find(".quiz-detail");
            var data = this.getDetailValues($d);
            if (data.id) {
                this.v.apiPut("Quiz", data, function () {
                    _this.saved();
                });
            }
            else {
                this.v.apiPost("Quiz", data, function (newId) {
                    $d.data("id", newId);
                    _this.saved();
                });
            }
        };
        QuizAdminPage.prototype.saved = function () {
            var id = new Common.InfoDialog();
            id.create("Saved", "Was saved");
        };
        QuizAdminPage.prototype.registerFileInputs = function () {
            var _this = this;
            $(".item-file-input").change(function (e) {
                var $t = $(e.target);
                var file = $t[0].files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (evnt) {
                    var $item = $t.closest(".item");
                    _this.onPhotoSelected($item, _this.currentNo, $item.data("no"), evnt.target["result"]);
                };
            });
        };
        QuizAdminPage.prototype.onPhotoSelected = function ($item, quizNo, itemNo, imgData) {
            var data = {
                quizNo: quizNo,
                itemNo: itemNo,
                data: imgData
            };
            this.v.apiPost("QuizPhoto", data, function () {
                $item.find(".image").attr("src", "/quiz/photo?quizNo=" + quizNo + "&itemNo=" + itemNo);
            });
        };
        QuizAdminPage.prototype.generateList = function () {
            var _this = this;
            var $t = $(this.v.registerTemplate("quiz-list-layout-tmp")());
            this.$cont.html($t);
            this.$list = this.$cont.find(".list");
            this.v.apiGet("Quiz", [["list", "true"], ["lang", this.currentLang]], function (items) {
                var lg = Common.ListGenerator.init(_this.$list.find(".items"), "quiz-list-item-tmp");
                lg.useNo = false;
                lg.evnt(".activate", function (e, $item, $target, item) {
                    var id = new Common.ConfirmDialog();
                    id.create("Activation", "Do you want to activate this quiz ?", "Cancel", "Yes", function () {
                        _this.activate(item, $item);
                    });
                });
                lg.evnt(".edit", function (e, $item, $target, item) {
                    _this.showDetail(item.no);
                });
                lg.generateList(items);
            });
        };
        QuizAdminPage.prototype.activate = function (item, $item) {
            var data = {
                specAction: "activate",
                no: item.no
            };
            this.v.apiPut("Quiz", data, function () {
                $item.find(".activate").remove();
            });
        };
        QuizAdminPage.prototype.showDetail = function (no) {
            var _this = this;
            var data1 = [["no", no], ["lang", this.currentLang]];
            this.v.apiGet("Quiz", data1, function (quiz) {
                _this.currentNo = quiz.no;
                _this.createDetail(quiz);
                _this.registerDetialActions();
            });
        };
        QuizAdminPage.prototype.createDetail = function (quiz) {
            var _this = this;
            if (!quiz) {
                quiz = {
                    title: "",
                    titleUrl: "",
                    no: this.currentNo,
                    items: []
                };
                for (var act = 1; act <= this.questionsCnt; act++) {
                    quiz.items.push({ no: act, options: [{ no: 1 }, { no: 2 }, { no: 3 }, { no: 4 }] });
                }
            }
            var t = this.v.registerTemplate("quiz-detail-layout-tmp");
            var $t = $(t(quiz));
            this.$cont.html($t);
            var $titleEdit = $t.find(".title");
            $titleEdit.on("input", function () {
                var txt = $titleEdit.val();
                var titleTxt = _this.cleanTitle(txt);
                $t.find(".title-url").val(titleTxt);
            });
            var items = _.map(quiz.items, function (i) {
                var o = {
                    id: i.id,
                    question: i.question,
                    no: i.no,
                    hasPhoto: i.hasPhoto,
                    quizNo: _this.currentNo,
                    option1: _this.findOptionByNo(i.options, 1),
                    option2: _this.findOptionByNo(i.options, 2),
                    option3: _this.findOptionByNo(i.options, 3),
                    option4: _this.findOptionByNo(i.options, 4),
                    correctNo: i.correctNo
                };
                return o;
            });
            var lg = Common.ListGenerator.init($t.find(".items"), "quiz-detail-item-tmp");
            lg.useNo = false;
            lg.generateList(items);
            this.registerFileInputs();
        };
        QuizAdminPage.prototype.getDetailValues = function ($detail) {
            var _this = this;
            var result = {
                id: $detail.data("id"),
                no: this.currentNo,
                lang: $detail.data("lang"),
                title: $detail.find(".title").val(),
                titleUrl: $detail.find(".title-url").val(),
                items: []
            };
            var $items = $detail.find(".item");
            $items.each(function (i, item) {
                var $item = $(item);
                var itm = {
                    id: $item.data("id"),
                    question: $item.find(".question").val(),
                    no: $item.data("no"),
                    options: _this.getOptions($item),
                    correctNo: _this.getCurrectOption($item)
                };
                result.items.push(itm);
            });
            return result;
        };
        QuizAdminPage.prototype.getCurrectOption = function ($item) {
            var $cbs = $item.find(".correct-cb");
            var correct = null;
            $cbs.each(function (i, opt) {
                var $o = $(opt);
                if ($o.prop("checked")) {
                    correct = $o.data("no");
                }
            });
            return correct;
        };
        QuizAdminPage.prototype.getOptions = function ($item) {
            var options = [];
            for (var act = 1; act <= 4; act++) {
                var val = $item.find(".opt" + act).val();
                var obj = {
                    no: act,
                    text: val
                };
                options.push(obj);
            }
            return options;
        };
        QuizAdminPage.prototype.cleanTitle = function (txt) {
            var n = txt.replace(/-/g, "").replace(/'/g, "").replace(/,/g, "").replace(/`/g, "").replace(/ /g, "-");
            return n;
        };
        QuizAdminPage.prototype.findOptionByNo = function (options, no) {
            var option = _.find(options, { no: no });
            return option.text;
        };
        return QuizAdminPage;
    }(Views.AdminPageBase));
    Views.QuizAdminPage = QuizAdminPage;
})(Views || (Views = {}));
//# sourceMappingURL=QuizAdminPage.js.map