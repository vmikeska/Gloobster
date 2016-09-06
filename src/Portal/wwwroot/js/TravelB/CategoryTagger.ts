module TravelB {
	export class CategoryTagger {

			public onFilterChange: Function;

			private tabs;

			private $cont;
			private $selected;
			private $dataCont;
			private instName;

			private data;
			
		private layout() {
			var $l = $(`<div class="wantDosMain"><div class="selected"></div><div class="tabsCont"></div><div class="dataCont"></div></div>`);
			this.$cont.html($l);
		}

		public initData(data) {
			data.forEach((id) => {
				var res = this.findItemById(id);
				if (res !== null) { 
					var $t = this.tagItem(res.foundCat, id, res.foundItem.text);
					this.$selected.append($t);
				}
			});
		}

		public create($cont, instName: string, data) {
			this.instName = instName;
			this.data = data;
			this.$cont = $cont;
			this.layout();

			this.$selected = $cont.find(".selected");
			var $tc = $cont.find(".tabsCont");
			this.$dataCont = this.$cont.find(".dataCont");

			this.tabs = new Tabs($tc, "WantDo", 30);

			this.data.forEach((catData) => {

				var groupName = catData.k;

				this.tabs.addTab(this.tabId(instName, catData.k), groupName, () => {
					this.tabClick(catData);
				});
			});

			this.tabs.create();				
		}

		private findItemById(id) {
			var found = false;
			var foundItem;
			var foundCat;

			this.data.forEach((catData) => {
				var item = _.find(catData.items, (d) => { return d.id === id; });
				if (item) {
					foundItem = item;
					foundCat = catData.k;
					found = true;
				}
			});

			if (found) {
				return { foundItem: foundItem, foundCat: foundCat };
			} else {
				return null;
			}
		}

		private tabId(instName, catName) {
			return `tab_${instName}_${catName}`;
		}

		private tabClick(catData) {

			var itms = catData.items;
				
			this.$dataCont.html("");
				
			var ids = this.getSelectedIds();
			itms = _.reject(itms, (i) => {
				return _.contains(ids, i.id);
			});

		  //add the root one ?
			//var $di = this.catItem(key.k, key.id, key.k);
			//this.$dataCont.append($di);

			itms.forEach((i) => {
				var $i = this.catItem(catData.k, i.id, i.text);
				this.$dataCont.append($i);
			});
			}

		public getSelectedIds() {
			var ids = [];
			var tags = this.$selected.find(".tag").toArray();
			tags.forEach((t) => {
				var $t = $(t);
				ids.push($t.data("id"));
			});
			return ids;
		}

		private catItem(catId, id, name) {
			var $i = $(`<span class="tag" data-catid="${catId}" data-id="${id}">${name}</span>`);
			$i.click((e) => {
				e.preventDefault();
				this.addToSelected(catId, id, name);
				$i.remove();
			});
			return $i;
		}

		private tagItem(catId, id, name) {
			var $i = $(`<span class="tag" data-catid="${catId}" data-id="${id}">${name}<a class="icon-cross" href="#"></a></span>`);
			$i.find("a").click((e) => {
				e.preventDefault();

				if (this.tabs.activeTabId === this.tabId(this.instName, catId)) {
						var $di = this.catItem(catId, id, name);
						this.$dataCont.append($di);
				}

				$i.remove();
				if (this.onFilterChange) {
					this.onFilterChange(false, id);
				}
			});
			return $i;
		}

		private addToSelected(catId, id, name) {
			var $t = this.tagItem(catId, id, name);
			this.$selected.append($t);
			if (this.onFilterChange) {
					this.onFilterChange(true, id);
			}
		}

	}
}