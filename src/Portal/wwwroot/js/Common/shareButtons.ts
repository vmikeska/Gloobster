module Common {
		export class NShareButtons {

				private $owner: any;

				public onSelectionChanged: Function;

				private socNetworks = [
						{ type: SocialNetworkType.Facebook, iconName: "facebook" },
						{ type: SocialNetworkType.Twitter, iconName: "twitter" }
				];

				private activeTag = '<span class="icon-visited"></span>';

				constructor($owner) {
						this.$owner = $owner;

						this.createHtml();
				}


				public getSelectedNetworks() {
						var selected = [];
						this.$owner.find("div").toArray().forEach((div) => {
								var $div = $(div);
								if (this.isActive($div)) {
										selected.push(parseInt($div.data("t")));
								}
						});
						return selected;
				}

				private createHtml() {
						var isFirst = true;
						this.socNetworks.forEach((net) => {
								if (Views.ViewBase.currentView.hasSocNetwork(net.type)) {
										var $div = this.getItemHtml(isFirst, true, net.type);
										this.$owner.append($div);
										isFirst = false;
								}
						});
				}

				private getByType(type: SocialNetworkType) {
						return _.find(this.socNetworks, (net) => { return net.type === type });
				}

				private getItemHtml(isFirst: boolean, active: boolean, type: SocialNetworkType) {
						var pos = isFirst ? "" : " mleft10";
						var soc = this.getByType(type);

						var $itemDiv = $(`<div data-t="${type}" class="icon-holder minus"><img class="opacity5 middle${pos}" src="../../images/share-${soc.iconName}.png">${this.activeTag}</div>`);

						$itemDiv.click((e) => {
								var active = this.isActive($itemDiv);
								if (active) {
										var span = $itemDiv.find(".icon-visited");
										span.remove();
								} else {
										$itemDiv.append(this.activeTag);
								}

								if (this.onSelectionChanged) {
										var str = this.getStr();
										this.onSelectionChanged(str);
								}
						});

						return $itemDiv;
				}

				public getStr() {
						var nets = this.getSelectedNetworks();
						var outArray = [];
						if (_.contains(nets, 0)) {
								outArray.push("Facebook");
						}
						if (_.contains(nets, 2)) {
								outArray.push("Twitter");
						}
						var str = `(${outArray.join()})`;
						return str;
				}

				private isActive($div) {
						var visitedSpan = $div.find(".icon-visited");
						return visitedSpan.length === 1;
				}

		}



	export class ShareButtons {

		private $owner: any;

	  public onSelectionChanged: Function;

		private socNetworks = [
			{ type: SocialNetworkType.Facebook, iconName: "facebook" },
			{ type: SocialNetworkType.Twitter, iconName: "twitter" }
		];

		private activeTag = '<span class="icon-visited"></span>';

		constructor($owner) {
			this.$owner = $owner;

		  this.createHtml();
		}


		public getSelectedNetworks() {
			var selected = [];
			this.$owner.find("div").toArray().forEach((div) => {
				var $div = $(div);
				if (this.isActive($div)) {
					selected.push(parseInt($div.data("t")));
				}
			});
			return selected;
		}

		private createHtml() {						
			var isFirst = true;
			this.socNetworks.forEach((net) => {
				if (Views.ViewBase.currentView.hasSocNetwork(net.type)) {
					var $div = this.getItemHtml(isFirst, true, net.type);
					this.$owner.append($div);
					isFirst = false;
				}
			});		 
		}

		private getByType(type: SocialNetworkType) {
			return _.find(this.socNetworks, (net) => { return net.type === type });
		}

		private getItemHtml(isFirst: boolean, active: boolean, type: SocialNetworkType) {
			var pos = isFirst ? "" : " mleft10";			
			var soc = this.getByType(type);

			var $itemDiv = $(`<div data-t="${type}" class="icon-holder minus"><img class="opacity5 middle${pos}" src="../../images/share-${soc.iconName}.png">${this.activeTag}</div>`);
		 
			$itemDiv.click((e) => {			 
			 var active = this.isActive($itemDiv);			  
				if (active) {
				 var span = $itemDiv.find(".icon-visited");
					span.remove();
				} else {
				 $itemDiv.append(this.activeTag);
			 }

				if (this.onSelectionChanged) {
				 var str = this.getStr();
				 this.onSelectionChanged(str);
				}
			});

			return $itemDiv;
		}

		public getStr() {
			var nets = this.getSelectedNetworks();
			var outArray = [];
			if (_.contains(nets, 0)) {
				outArray.push("Facebook");
			}
			if (_.contains(nets, 2)) {
				outArray.push("Twitter");
			}
			var str = `(${outArray.join()})`;
			return str;
		}

		private isActive($div) {
			var visitedSpan = $div.find(".icon-visited");
			return visitedSpan.length === 1;
		}

	}
}