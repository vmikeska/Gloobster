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

		private actClass = "act";

		private $cont;
		private tabGroup;
		
		constructor($cont, tabGroup) {
			this.$cont = $cont;
			this.tabGroup = tabGroup;		
		}

		private tabs = [];

		public addTab(id, text, callback: Function = null) {
			this.tabs.push({ id: id, text: text, callback: callback });
		}

		public addTabConf(config, callback: Function = null) {

			var cfg = $.extend(config, { callback: callback });

			this.tabs.push(cfg);
		}

		public create() {
			this.tabs.forEach((t) => {
					var $t = this.genTab(t);

					if (t.cls) {
						$t.addClass(t.cls);
					}

				this.$cont.append($t);
				});

			 this.$cont.addClass(this.contClass);

			if (this.initCall) {
				this.tabs[0].callback();
			}

			this.activeTabId = this.tabs[0].id;
		}

		public activateTab($btn) {
			this.deactivate();
			this.activate($btn);
		}

		private genTab(t) {
				var $t = $(`<div class="${this.btnContClass}"><div id="${t.id}" class="${this.btnClass} ${this.tabGroup}">${t.text}</div></div>`);

			var $btn = $t.find(".btn");

			if (this.isFirst) {
					$btn.addClass(this.actClass);
				this.isFirst = false;
			}

			$btn.click((e) => {
				e.preventDefault();

				if ($btn.hasClass(this.actClass)) {
					return;
				}
					
				if (this.onBeforeSwitch) {
					this.onBeforeSwitch();
				}

				var $target = $(e.target);

				this.deactivate();					
				this.activate($target);

				if (t.callback) {
					t.callback(t.id);
				}

				if (this.onChange) {
						this.onChange(t.id);
				}
			});

			return $t;
			}

			private activate($btn) {
					$btn.addClass(this.actClass);
					this.activeTabId = $btn.attr("id");
			}

			private deactivate() {
					$(`.${this.tabGroup}`).removeClass(this.actClass);
			}


	}
}