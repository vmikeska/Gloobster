module Planning {
	export class TaggingFieldConfig {
		public customId: string;
		public containerId: string;
		public itemsRange: any[];
		public localValues: boolean;
		public listSource: string;
		public placeholder: string;
		public clientMatch = true;
	}

	export class TaggingField {
		public onItemClickedCustom: Function;
		public onDeleteCustom: Function;
		public onChange: Function;

		private $tagger: any;
		private $cont: any;

		private taggerTemplate = Views.ViewBase.currentView.registerTemplate("tagger-template");
		public selectedItems = [];
		private config: TaggingFieldConfig;

		constructor(config: TaggingFieldConfig) {
			this.config = config;

			var v = Views.ViewBase.currentView;

			if (!this.config.placeholder) {
					this.config.placeholder = v.t("TaggingFieldPlacehoder", "jsLayout");
			}

			this.$cont = $(`#${this.config.containerId}`);
				
			this.$tagger = this.createTagger();
			this.$cont.prepend(this.$tagger);
		}

		public setSelectedItems(selectedItems) {
			this.selectedItems = selectedItems;
			this.initTags(selectedItems);
		}

		private initTags(selectedItems) {
			this.$cont.find(".tag").remove();

			selectedItems.forEach((selectedItem) => {

				var item = null;

				if (this.config.localValues) {
					item = _.find(this.config.itemsRange, (i) => { return i.kind === selectedItem.kind && i.value === selectedItem.value });
				} else {
					item = selectedItem;
				}

				if (item) {
					var $html = this.createTag(item.text, item.value, item.kind);
					this.$cont.prepend($html);
				}
			});
		}

		private createTag(text, value, kind) {			
			var $html = $(`<span class="tag" data-vl="${value}" data-kd="${kind}">${text}<a class="icon-cross-small" href="#"></a></span>`);
			$html.find("a").click((e) => {
					e.preventDefault();
					var $target = $(e.target);
					this.removeTag($target, $html);
			});

			return $html;
		}

		private removeTag($target, $html) {
			var val = $target.parent().data("vl");

			this.selectedItems = _.reject(this.selectedItems, (i) => {
					return i.value === val;
			});

			this.onDeleteCustom(val, () => {
					$html.remove();		
					if (this.onChange) {
							this.onChange(this.selectedItems);
					}		
			});
		}

		private createTagger() {

				var context = {
						placeholder: this.config.placeholder
				}

			var html = this.taggerTemplate(context);
			var $html = $(html);

			var $input = $html.find("input");

			var $ul = $html.find("ul");

			$input.keyup((e) => {
				this.fillTagger($input, $ul);
			});

			$input.focus((e) => {
					//not sure what race condition im soliving here
				setTimeout(() => {
					this.fillTagger($input, $ul);
					$ul.show();
				}, 250);
			});

			$input.focusout((e) => {
				setTimeout(() => {
					$input.val("");
					$ul.hide();
				}, 250);
			});

			return $html;
		}

		private fillTagger($input, $ul) {			
			$ul.html("");

			var inputVal = $input.val().toLowerCase();
				
			this.getItemsRange(inputVal, (items) => {
				items.forEach((item) => {

					var strMatch = true;
					if (this.config.clientMatch) {
							strMatch = (inputVal === "") || (item.text.toLowerCase().startsWith(inputVal));
					}

					var alreadySelected = _.find(this.selectedItems, (i) => {
						return (i.value === item.value) && (i.kind === item.kind);							
					});

					if (strMatch && !alreadySelected) {
						var $item = this.createTaggerItem(item.text, item.value, item.kind);
						$ul.append($item);
					}

				});
			});
		}

		private getItemsRange(query, callback) {
			var itemsRange = null;
			if (this.config.localValues) {
				callback(this.config.itemsRange);
			} else {
				var prms = [["query", query]];
				Views.ViewBase.currentView.apiGet(this.config.listSource, prms, (items) => {
					callback(items);
				});

			}
		}

		private createTaggerItem(text, value, kind) {
			var $html = $(`<li data-vl="${value}" data-kd="${kind}">${text}</li>`);

			$html.click((e) => {
				e.preventDefault();		
					this.onItemClicked($html);
			});

			return $html;
		}

		private onItemClicked($target) {
			var val = $target.data("vl");
			var kind = $target.data("kd");
			var text = $target.text();

			this.selectedItems.push({ value: val, kind: kind });

			this.onItemClickedCustom($target, () => {
				var $tag = this.createTag(text, val, kind);
				this.$tagger.before($tag);				
			});

			if (this.onChange) {
				this.onChange(this.selectedItems);
			}
		}


	}
}