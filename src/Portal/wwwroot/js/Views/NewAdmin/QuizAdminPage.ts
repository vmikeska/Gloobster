module Views {


		export class QuizAdminPage extends AdminPageBase {
				constructor(v: NewAdminView) {
						super(v);
				}

				private $list;

				private questionsCnt = 10;
				private currentNo;
				private currentLang;


				createCustom() {
						this.currentLang = "en";

						this.generateList();
						this.registerListActions();
				}

				private registerListActions() {
						this.$cont.find("#addNewQuiz").click((e) => {
								e.preventDefault();

								var data2 = [["getEmptyNumber", "true"]];

								this.v.apiGet("Quiz", data2, (avaiableNo) => {

										this.currentNo = avaiableNo;

										this.createDetail(null);
										this.registerDetialActions();
								});
						});
				}

				private registerDetialActions() {
						this.$cont.find("#btnSave").click((e) => {
								e.preventDefault();

								this.save();
						});

						this.$cont.find("#btnCancel").click((e) => {
								e.preventDefault();

								this.generateList();
						});

						this.$cont.find(".correct-cb").click((e) => {
								var $t = $(e.target);
								var $i = $t.closest(".item");
								var $cbs = $i.find(".correct-cb");

								$cbs.prop("checked", false);

								$t.prop("checked", true);
						});
				}

				private save() {
						var $d = this.$cont.find(".quiz-detail");
						var data = this.getDetailValues($d);

						if (data.id) {
								this.v.apiPut("Quiz", data, () => {


								});
						} else {
								this.v.apiPost("Quiz", data, () => {


								});
						}
				}

				private registerFileInputs() {

						$(".item-file-input").change((e) => {
								var $t = $(e.target);
								var file = $t[0].files[0];

								var reader = new FileReader();
								reader.readAsDataURL(file);
								reader.onload = (evnt) => {
										var $item = $t.closest(".item");
										this.onPhotoSelected($item, this.currentNo, $item.data("no"), evnt.target["result"]);
								};

						});

				}

				private onPhotoSelected($item, quizNo, itemNo, imgData) {

						var data = {
								quizNo: quizNo,
								itemNo: itemNo,
								data: imgData
						};

						this.v.apiPost("QuizPhoto", data, () => {
								$item.find(".image").attr("src", `/quiz/photo?quizNo=${quizNo}&itemNo=${itemNo}`);
						});
				}

				private generateList() {

						var $t = $(this.v.registerTemplate("quiz-list-layout-tmp")());
						this.$cont.html($t);

						this.$list = this.$cont.find(".list");

						this.v.apiGet("Quiz", [["list", "true"], ["lang", this.currentLang]], (items) => {
								var lg = Common.ListGenerator.init(this.$list.find(".items"), "quiz-list-item-tmp");
								lg.useNo = false;

								lg.evnt(".share", (e, $item, $target, item) => {

										var id = new Common.ConfirmDialog();
										id.create("Sharing to soc net", "Do you want to share it to soc nets ?", "Cancel", "Yes", () => {
												this.shareToSocNet(item);
										});

								});

								lg.evnt(".activate", (e, $item, $target, item) => {

										var id = new Common.ConfirmDialog();
										id.create("Activation", "Do you want to activate this quiz ?", "Cancel", "Yes", () => {
												this.activate(item, $item);
										});

								});

								lg.evnt(".edit", (e, $item, $target, item) => {

										this.showDetail(item.no);

								});



								lg.generateList(items);
						});
				}

				private activate(item, $item) {

						var data = {
								specAction: "activate",
								no: item.no
						};

						this.v.apiPut("Quiz", data, () => {
								$item.find(".activate").remove();
						});

				}

				private shareToSocNet(item) {
						//todo:
				}

				private showDetail(no) {

						var data1 = [["no", no], ["lang", this.currentLang]];
						this.v.apiGet("Quiz", data1, (quiz) => {

								this.currentNo = quiz.no;

								this.createDetail(quiz);
								this.registerDetialActions();
						});
				}

				private createDetail(quiz) {

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

						$titleEdit.on("input", () => {
								var txt = $titleEdit.val();
								var titleTxt = this.cleanTitle(txt);
								$t.find(".title-url").val(titleTxt);
						});

						var items = _.map(quiz.items, (i) => {

							var o = {
								id: i.id,
								question: i.question,
								no: i.no,
								hasPhoto: i.hasPhoto,
								quizNo: this.currentNo,
								option1: this.findOptionByNo(i.options, 1),
								option2: this.findOptionByNo(i.options, 2),
								option3: this.findOptionByNo(i.options, 3),
								option4: this.findOptionByNo(i.options, 4),
								correctNo: i.correctNo
						};

								return o;
						});

						var lg = Common.ListGenerator.init($t.find(".items"), "quiz-detail-item-tmp");
						lg.useNo = false;
						lg.generateList(items);

						this.registerFileInputs();

				}

				private getDetailValues($detail) {

						var result = {
								id: $detail.data("id"),
								no: this.currentNo,
								lang: $detail.data("lang"),
								title: $detail.find(".title").val(),
								titleUrl: $detail.find(".title-url").val(),
								items: []
						};

						var $items = $detail.find(".item");

						$items.each((i, item) => {
								var $item = $(item);

								var itm = {
										id: $item.data("id"),
										question: $item.find(".question").val(),
										no: $item.data("no"),
										options: this.getOptions($item),
										correctNo: this.getCurrectOption($item)
								};

								result.items.push(itm);
						});

						return result;
				}

				private getCurrectOption($item) {

						var $cbs = $item.find(".correct-cb");

						var correct = null;

						$cbs.each((i, opt) => {
								var $o = $(opt);
								if ($o.prop("checked")) {
										correct = $o.data("no");
								}
						});

						return correct;
				}

				private getOptions($item) {
						var options = [];

						for (var act = 1; act <= 4; act++) {
								var val = $item.find(`.opt${act}`).val();

								var obj = {
										no: act,
										text: val
								};
								options.push(obj);
						}

						return options;
				}

				private cleanTitle(txt) {
						var n = txt.replace(/-/g, "").replace(/'/g, "").replace(/,/g, "").replace(/`/g, "").replace(/ /g, "-");
						return n;
				}

				private findOptionByNo(options, no) {
						var option = _.find(options, { no: no });
						return option.text;
				}
		}


}