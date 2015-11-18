class AirportCombo {
	private $combo: any;
	private $cont: any;
	private $input: any;
	private limit = 10;
	private lastText: string;

	public onSelected: Function;

	constructor(comboId: string) {
		this.$combo = $("#" + comboId);
		this.$cont = this.$combo.find("ul");
		this.$input = this.$combo.find("input");
		this.registerInput();
		this.registerInOut();
	}

	public setText(text) {
		this.lastText = text;
		this.$input.val(text);
	}

	private registerInOut() {
		this.$input.focus((e) => {
			$(e.target).val("");
		});
		this.$input.focusout(() => {
			this.setText(this.lastText);
		});
	}

	private registerInput() {
		var d = new DelayedCallback(this.$input);
		d.callback = (str) => {
			var data = [["query", str], ["limit", this.limit]];
			Views.ViewBase.currentView.apiGet("airport", data, (items) => this.onResult(items));
		}
	}

	private onResult(items) {
		this.displayResults(items);
	}

	private displayResults(items) {
		if (!items) {
			return;
		}

		this.$cont.html("");

		items.forEach((item) => {
			var itemHtml = this.getItemHtml(item);
			this.$cont.append(itemHtml);
		});
		this.registerClick();
	}

	private registerClick() {
		this.$cont.find("li").click((evnt) => {
			var $t = $(evnt.target);
			this.onClick($t);
		});
	}

	private onClick($item) {
		var selName = $item.data("value");
		var selId = $item.data("id");
		this.$input.val(selName);

		this.$cont.html("");

		var data = { id: selId, name: selName };
		this.onSelected(data);
	}

	private getItemHtml(item) {
		var code = item.iataFaa;
		if (code === "") {
			code = item.icao;
		}

		var displayName = `${item.name} (${item.city})`;
		var displayNameSel = `${item.city} (${code})`;

		return `<li data-value="${displayNameSel}" data-id="${item.id}">${displayName}<span class="color2">• ${code}</span></li>`;
	}
}