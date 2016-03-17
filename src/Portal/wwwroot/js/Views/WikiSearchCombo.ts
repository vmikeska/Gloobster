module Views {
	export class WikiSearchCombo {
		private $combo;
		private $input;

	  public selectionCallback: Function;
	  
		private delayedCallback: Common.DelayedCallback;
	 
		public initId(id) {
			this.$combo = $("#" + id);
			this.init();
		}

		public initElement($combo) {
			this.$combo = $combo;
			this.init();
		}

		private init() {
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

			var $ul = this.$combo.find("ul");

			$ul.html(htmlContent);		

			if (this.selectionCallback) {
				$ul.find("a").click((e) => {
				 e.preventDefault();
					this.selectionCallback($(e.target));
				});
			}
		}

		private getItemHtml(item) {
			return `<li><a data-articleId="${item.articleId}" href="/wiki/${item.language}/${item.link}">${item.title}</a></li>`;
		}

	}
}