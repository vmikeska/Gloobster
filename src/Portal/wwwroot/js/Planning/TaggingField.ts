class TaggingFieldConfig {
	public customId: string;
	public containerId: string;
	public itemsRange: any[];
  public localValues: boolean;
  public listSource: string;
} 

class TaggingField {
	private $tagger: any;
	private $cont: any;
 
	private taggerTemplate: any;
	private selectedItems: any;
	private config: TaggingFieldConfig;

	constructor(config: TaggingFieldConfig) {
		this.config = config;
	 
		this.taggerTemplate = Views.ViewBase.currentView.registerTemplate("tagger-template");
		this.$cont = $("#" + this.config.containerId);

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
		var html = `<a class="tag" href="#" data-vl="${value}" data-kd="${kind}">${text}</a>`;
		var $html = $(html);
		return $html;
	}

	private createTagger() {
		var html = this.taggerTemplate();
		var $html = $(html);

		var $input = $html.find("input");

		var $ul = $html.find("ul");

		$input.keyup((e) => {
			this.fillTagger($input, $ul);
		});

		$input.focus((e) => {
			this.fillTagger($input, $ul);
			$ul.show();
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

				var strMatch = (inputVal === "") || (item.text.toLowerCase().indexOf(inputVal) > -1);
				var alreadySelected = _.find(this.selectedItems, (i) => { return i.kind === item.kind && i.value === item.value });

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
		var html = `<li data-vl="${value}" data-kd="${kind}">${text}</li>`;	 
		var $html = $(html);

		$html.click((e) => {			
			var $target = $(e.target);
			this.onItemClicked($target);
		});
	
		return $html;
	}
 
	public onItemClickedCustom: Function;

	private onItemClicked($target) {
		var val = $target.data("vl");
		var kind = $target.data("kd");
		var text = $target.text();

		this.onItemClickedCustom($target, () => {
			var $tag = this.createTag(text, val, kind);
			this.$tagger.before($tag);
			this.selectedItems.push({ value: val, kind: kind });
		});	 	 
	}


}