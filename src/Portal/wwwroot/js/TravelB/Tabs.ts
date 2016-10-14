module TravelB {

		export class Tabs {

				public onBeforeSwitch: Function;
				public activeTabId;

				private $cont;
				private tabGroup;
				private height;

				constructor($cont, tabGroup, height) {
						this.$cont = $cont;
						this.tabGroup = tabGroup;
						this.height = height;
				}

				private tabs = [];
				
				public addTab(id, text, callback) {
						this.tabs.push({ id: id, text: text, callback: callback });
				}

				public create() {
						this.tabs.forEach((t) => {
								var $t = this.genTab(t);
								this.$cont.append($t);
						});

						this.tabs[0].callback();
						this.activeTabId = this.tabs[0].id;
				}

				private isFirst = true;

				private genTab(t) {
						var width = (100 / this.tabs.length);

						var $t = $(`<div id="${t.id}" class="myTab ${this.tabGroup}" style="width: calc(${width}% - 2px); height: ${this.height}px">${t.text}</div>`);

						if (this.isFirst) {
								$t.addClass("act");
								this.isFirst = false;
						}

						$t.click((e) => {
								e.preventDefault();

								if ($t.hasClass("act")) {
										return;
								}

								if (this.onBeforeSwitch) {
										this.onBeforeSwitch();
								}

								var $target = $(e.target);

								$(`.${this.tabGroup}`).removeClass("act");
								$target.addClass("act");
								this.activeTabId = $target.attr("id");
								t.callback(t.id);
						});

						return $t;
				}


		}

	export class MenuTabs {
			
		public onBeforeSwitch: Function;
		public activeTabId;

		private activeCls = "active";

		private $cont;		

		constructor($cont) {
			this.$cont = $cont;			
		}

		private tabs = [];

		private btnTemplate;

				public addTab(config, callback) {
						this.tabs.push({ id: config.id, text: config.text, customClass: config.customClass, callback: callback });
				}

		public create(btnTemplate) {
			this.btnTemplate = btnTemplate;

			this.tabs.forEach((t) => {
				var $t = this.genTab(t);
				this.$cont.append($t);
			});

			this.tabs[0].callback();
			this.activeTabId = this.tabs[0].id;
		}

		private isFirst = true;

		private genTab(t) {
				
				var $t = $(this.btnTemplate);
				$t.addClass(t.customClass);
				$t.html(t.text);
				$t.attr("id", t.id);
				
			if (this.isFirst) {
					$t.addClass(this.activeCls);
				this.isFirst = false;
			}

			$t.click((e) => {
				e.preventDefault();

				if ($t.hasClass(this.activeCls)) {
					return;
				}

				if (this.onBeforeSwitch) {
					this.onBeforeSwitch();
				}

				var $target = $(e.target);

				this.$cont.children().removeClass(this.activeCls);
				$target.addClass(this.activeCls);
				this.activeTabId = $target.attr("id");
				t.callback(t.id);
			});

			return $t;
		}


	}
}