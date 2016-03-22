module Views {
	export class WikiHomeView extends ViewBase {
	 private combo: WikiSearchCombo;

	 constructor() {
		 super();
		 this.combo = new WikiSearchCombo();
		 this.combo.initId("SearchCombo", { showRating: true});
	 }
	}
}