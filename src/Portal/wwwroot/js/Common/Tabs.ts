module Common {
	export class Tabs {

		public onBeforeSwitch: Function;
		public onChange: Function;

		public activeTabId;

		private isFirst = true;

		public initCall = true;
		private btnClass = "btn";
		private btnContClass = "btn-cont";
		private contClass = "tab-menu";

		private $cont;
		private tabGroup;
		
		constructor($cont, tabGroup) {
			this.$cont = $cont;
			this.tabGroup = tabGroup;		
		}

		private tabs = [];

		public addTab(id, text, callback = null) {
			this.tabs.push({ id: id, text: text, callback: callback });
		}

		public create() {
			this.tabs.forEach((t) => {
				var $t = this.genTab(t);
				this.$cont.append($t);
				});

			 this.$cont.addClass(this.contClass);

			if (this.initCall) {
				this.tabs[0].callback();
			}

			this.activeTabId = this.tabs[0].id;
		}
			
		private genTab(t) {
				var $t = $(`<div class="${this.btnContClass}"><div id="${t.id}" class="${this.btnClass} ${this.tabGroup}">${t.text}</div></div>`);

			var $btn = $t.find(".btn");

			if (this.isFirst) {
					$btn.addClass("act");
				this.isFirst = false;
			}

			$btn.click((e) => {
				e.preventDefault();

				if ($btn.hasClass("act")) {
					return;
				}
					
				if (this.onBeforeSwitch) {
					this.onBeforeSwitch();
				}

				var $target = $(e.target);

				$(`.${this.tabGroup}`).removeClass("act");
				$target.addClass("act");
				this.activeTabId = $target.attr("id");

				if (t.callback) {
					t.callback(t.id);
				}

				if (this.onChange) {
						this.onChange(t.id);
				}
			});

			return $t;
		}


	}
}