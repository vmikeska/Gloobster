module Views {
		export class WikiHomeView extends ViewBase {
				private combo: WikiSearchCombo;

				constructor() {
						super();

						this.combo = new WikiSearchCombo();
						this.combo.initId("SearchCombo", { showRating: true });

						this.regMoreBtn();
				}

				private regMoreBtn() {
						$(".more-btn").click((e) => {
							this.changeInfoVisibility();
						});
						$(".close").click((e) => {
								this.changeInfoVisibility();
						});
				}

				private changeInfoVisibility() {
						$(".wiki-info-all").toggleClass("collapsed");
				}
		}
}