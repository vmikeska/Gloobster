module Views {



		export class QuizDetailView extends ViewBase {

				private currentItem = 1;
				private maxItems = 10;
				private results = [];

				constructor() {
						super();
				}

				private init() {
						this.regArrows();
						this.regOptions();
				}

				private regOptions() {
						$(".option-cont").click((e) => {
								var $t = $(e.target);
								var itemNo = $t.closest(".quiz-item").data("no");
								var optNo = $t.data("no");

								var result = this.getOptionRes(itemNo);
								result.voted = optNo;

							//console.log(`itemNo: ${itemNo}, optNo: ${optNo}, voted: ${result.voted}`);

								this.onChange();

								this.move(true);
								this.setOptions(this.currentItem);
						});
				}

				private getOptionRes(itemNo) {
						var result = _.find(this.results, { itemNo: itemNo });

						if (!result) {
								result = { itemNo: itemNo, voted: null };
								this.results.push(result);
						}

						return result;
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
						alert(score);
				}

				private countScore() {
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
				}

				private allVoted() {

						var isFull = true;

						for (var act = 1; act <= this.maxItems; act++) {
								var res = this.getOptionRes(act);
								if (!res.voted) {
										isFull = false;
								}
						}

						return isFull;
				}

				private setOptions(no) {
						var result = this.getOptionRes(no);

						if (!result.voted) {
								return;
						}

						var $i = this.getItemByNo(no);
						var $o = $i.find(`.option-cont[data-no="${result.voted}"]`);

						$i.find(".option-cont").removeClass("active");

						$o.addClass("active");
				}

				private getItemByNo(no) {
						return $(`.quiz-item[data-no="${no}"]`);
				}

		}
}