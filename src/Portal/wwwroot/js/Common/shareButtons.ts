module Common {
	export class ShareButtons {

		private $owner: any;

		private socNetworks = [
			{ type: SocialNetworkType.Facebook, iconName: "facebook" },
			{ type: SocialNetworkType.Twitter, iconName: "twitter" }
		];

		constructor($owner, text) {
			this.$owner = $owner;

		  this.createHtml(text);
		}


		public getSelectedNetworks() {
			var selected = [];
			this.$owner.find("img").toArray().forEach((i) => {
				var $i = $(i);
				if ($i.hasClass("active")) {
					selected.push(parseInt($i.data("t")));
				}
			});
			return selected;
		}

		private createHtml(text) {
			var $p = $(`<p class="color1">${text}<br/></p>`);
			var isFirst = true;
			this.socNetworks.forEach((net) => {
				var $img = this.getItemHtml(isFirst, true, net.type);
				$p.append($img);
				isFirst = false;
			});

			this.$owner.prepend($p);
		}

		private getByType(type: SocialNetworkType) {
			return _.find(this.socNetworks, (net) => { return net.type === type });
		}

		private getItemHtml(isFirst: boolean, active: boolean, type: SocialNetworkType) {
			var pos = isFirst ? "" : " mleft10";
			var act = active ? "active " : "";
			var soc = this.getByType(type);
			var $img = $(`<img data-t="${type}" class="${act}opacity5 middle${pos}" src= "../../images/share/share-${soc.iconName}.png">`);

			$img.click((e) => {
				var active = $img.hasClass("active");
				if (active) {
					$img.removeClass("active");
				} else {
					$img.addClass("active");
				}
			});
			return $img;
		}

	}
}