module Views {



		export class QuizDetailView extends ViewBase {

				private currentItem = 1;
				private maxItems = 10;
				
				constructor() {
						super();						
				}

				private init() {
						this.regArrows();
						this.regOptions();
				}

				private regOptions() {
						$(".option-cont").click((e) => {
								var $t = $(e.delegateTarget);
							  var $i = $t.closest(".quiz-item");
								
								var optNo = $t.data("no");

								$i.data("v", optNo);
								
								this.onChange();

								this.move(true);
								this.setOptions(this.currentItem);
						});
				}

				private regArrows() {

						var $buttons = $(".buttons");

						$buttons.find(".left").click((e) => {
								this.move(false);
						});

						$buttons.find(".right").click((e) => {
								this.move(true);
						});

				}

				private move(forward: boolean) {
						if ((this.currentItem === 1 && !forward) || (this.currentItem === this.maxItems && forward)) {
								return;
						}

						if (forward) {
								this.currentItem++;
						} else {
								this.currentItem--;
						}

						for (var act = 1; act <= this.maxItems; act++) {

								var $i = $(`.quiz-item[data-no="${act}"]`);
								var show = this.currentItem === act;
								if (show) {
										$i.fadeIn();
								} else {
										$i.hide();
								}

						}

						this.setOptions(this.currentItem);

						$(".displayer .curr-page").html(this.currentItem);
				}

				private onChange() {

						if (this.allVoted()) {
								this.showFinished();
						}

				}

				private showFinished() {
						var score = this.countScore();

						var t = this.registerTemplate("quiz-result-tmp");

						var context = {
								titleUrl: $("#titleUrl").val(),
								score: score
						};

						var $t = $(t(context));

						$("#quizCont").html($t);
				}

				private countScore() {
						var correct = 0;

						var $items = $(".quiz-item");
						$items.each((i, item) => {
								var $item = $(item);
								var v = $item.data("v");
								var c = $item.data("c");
								if (c === v) {
										correct++;
								}
						});
						
						return correct;
				}

				private allVoted() {

						var isFull = true;

						var $items = $(".quiz-item");
						$items.each((i, item) => {
								var $item = $(item);
								var v = $item.data("v");
								
								if (!v) {
									isFull = false;
								}
						});

						return isFull;
				}

				private setOptions(no) {
						
						var $i = this.getItemByNo(no);

					var v = $i.data("v");

						if (!v) {
							return;
						}

						var $o = $i.find(`.option-cont[data-no="${v}"]`);

						$i.find(".option-cont").removeClass("active");

						$o.addClass("active");
				}

				private getItemByNo(no) {
						return $(`.quiz-item[data-no="${no}"]`);
				}

		}
}