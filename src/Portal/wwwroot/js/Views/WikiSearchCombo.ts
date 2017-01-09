module Views {
	export class WikiSearchCombo {
		private $combo;
		private $input;

		public selectionCallback: Function;

		private delayedCallback: Common.DelayedCallback;

		private config;

		public initId(id, config = null) {
			this.config = config;
			this.$combo = $(`#${id}`);
			this.init();
		}

		public initElement($combo) {
			this.$combo = $combo;
			this.init();
		}

		private init() {
			this.$input = this.$combo.find("input");
			this.delayedCallback = new Common.DelayedCallback(this.$input);
			this.delayedCallback.callback = (query) => {
			 if (query) {
				this.loader(true);
			 }
			 this.search(query);

			};
		}

		private loader(state: boolean) {
			if (state) {
				this.$combo.find(".loader").show();
			} else {
				this.$combo.find(".loader").hide();
			}
		}

		public search(query: string) {
			var params = [["query", query]];

			ViewBase.currentView.apiGet("WikiSearch", params, places => { this.showResults(places) });
		}

		private getDisabledItem(text) {
			return `<li class="disabled">${text}</li>`;			
		}

		private showResults(places) {
			places = _.sortBy(places, (p) => { return p.rating }).reverse();

			var $ul = this.$combo.find("ul");
			$ul.empty();
			$ul.show();

			var v = Views.ViewBase.currentView;
				
			var hasRated = (places.length > 0 && places[0].rating > 0);
			if (hasRated) {
					$ul.append(this.getDisabledItem(v.t("ArticlesRich", "jsWiki")));
		  }

			var ratedFinished = false;			
			places.forEach(item => {
				if (item.rating === 0 && !ratedFinished) {
						$ul.append(this.getDisabledItem(v.t("ArticlesHelpUs", "jsWiki")));
					ratedFinished = true;
				}

				var $li = this.getItemHtml(item);
				$ul.append($li);
			});

			if (this.selectionCallback) {
				$ul.find("a").click((e) => {
					e.preventDefault();
					this.selectionCallback($(e.target));
				});
			}

			this.loader(false);
		}

		private getItemHtml(item) {			
			var $stars = $(`<div class="stars"></div>`);

			if (this.config && this.config.showRating) {
				for (var act = 1; act <= 10; act = act + 2) {
					var actd_l = act / 2;
					var actd_r = (act + 1) / 2;

					var color_l = (actd_l <= item.rating) ? "active" : "inactive";
					var color_r = (actd_r <= item.rating) ? "active" : "inactive";

					var $star = $(`
								<div class="star" data-i="${act}">
										<div class="icon-star-left ${color_l}"></div>
										<div class="icon-star-right ${color_r}"></div>
								</div>`);

					$stars.append($star);
				}
			}

			var $li = $(`<li><a data-articleId="${item.articleId}" href="/wiki/${item.language}/${item.link}">${item.title}</a></li>`);
			$li.append($stars);
			
			return $li;
		}

	}
}