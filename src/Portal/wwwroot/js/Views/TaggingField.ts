class TaggingField {

	private taggerTemplate: any;
	private $cont: any;
	private itemsRange: any;
	private selectedItems: any;
	private $tagger: any;
	public customId: string;

	constructor(customId, containerId, itemsRange) {
		this.customId = customId;
	 
		this.itemsRange = itemsRange;
		this.taggerTemplate = Views.ViewBase.currentView.registerTemplate("tagger-template");
		this.$cont = $("#" + containerId);

		this.$tagger = this.createTagger(itemsRange);
		this.$cont.prepend(this.$tagger);	
	 
	}

	public setSelectedItems(selectedItems) {
		this.selectedItems = selectedItems;
		this.initTags(selectedItems);
	}

	private initTags(selectedItems) {
		this.$cont.find(".tag").remove();
		selectedItems.forEach((selectedItem) => {
			var item = _.find(this.itemsRange, (i) => { return i.kind === selectedItem.kind && i.value === selectedItem.value });
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

	private createTagger(items) {
		var html = this.taggerTemplate();
		var $html = $(html);

		var $input = $html.find("input");

		var $ul = $html.find("ul");

		$input.keyup((e) => {
			this.fillTagger($input, items, $ul);
		});

		$input.focus((e) => {
			this.fillTagger($input, items, $ul);
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

	private fillTagger($input, items, $ul) {
		$ul.html("");
		items.forEach((item) => {
			var inputVal = $input.val();
			var strMatch = (inputVal === "") || (item.text.indexOf(inputVal) > -1);
			var alreadySelected = _.find(this.selectedItems, (i) => { return i.kind === item.kind && i.value === item.value });
			
			if (strMatch && !alreadySelected) {
				var $item = this.createTaggerItem(item.text, item.value, item.kind);
				$ul.append($item);
			}
		});	 
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