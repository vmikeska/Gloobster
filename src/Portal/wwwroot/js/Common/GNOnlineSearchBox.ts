module Common {
	export class GNOnlineSearchBox {
		private $combo;

	  public onSelected: Function;

		constructor(id) {
			this.$combo = $(`#${id}`);
			var input = this.$combo.find(".inputed");

			var d = new DelayedCallback(input);
			d.callback = (query) => {
				this.search(query);
			}
		}


		private search(query) {
			var data = [["q", query]];

			Views.ViewBase.currentView.apiGet("GnOnline", data, (cities) => {
				this.fillItems(cities);
			});
		}

		private fillItems(cities) {
			var $ul = this.$combo.find("ul");

			this.$combo.find("li").remove();
			cities.forEach((city) => {
				var $ch = this.getCityHtml(city);
				$ul.append($ch);
			});
			this.registerEvents();
			$ul.show();
		}

	  private registerEvents() {
		  this.$combo.find("li").click((e) => {
			 e.preventDefault();
			 var $target = $(e.target);
			 if (this.onSelected) {
				this.onSelected($target.data("city"));				
			 }
			  this.$combo.find("li").remove();
		  });
	  }

		private getCityHtml(city) {
			var $li = $(`<li>${city.name}, ${city.countryName}</li>`);
			$li.data("city", city);
			return $li;
		}

	}
}