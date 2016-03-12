module Views {
	export class WikiHomeView extends ViewBase {
	 private combo: WikiSearchCombo;

	 constructor() {
		 super();
		 this.combo = new WikiSearchCombo("SearchCombo");
	 }
	}

	export class WikiSearchCombo {
	 private $combo;
	 private $input;

	 private delayedCallback: Common.DelayedCallback;

	 constructor(id) {
		this.$combo = $("#" + id);
		 this.$input = this.$combo.find("input");

		this.delayedCallback = new Common.DelayedCallback(this.$input);
		this.delayedCallback.callback = (query) => this.search(query);
	 }

	 public search(query: string) {		
		var params = [["query", query]];
		
		ViewBase.currentView.apiGet("WikiSearch", params, places => { this.showResults(places) });
	 }

	 private showResults(places) {
		this.$combo.find("ul").show();
		var htmlContent = "";
		places.forEach(item => {
		 htmlContent += this.getItemHtml(item);
		});
		
		this.$combo.find("ul").html(htmlContent);		
	 }

	 private getItemHtml(item) {
		 return `<li><a href="/wiki/${item.language}/${item.link}">${item.title}</a></li>`;
	 }

	}


}