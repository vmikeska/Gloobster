
//event: (e, $item, $target, item)
// = (item) => { return {isActive: true, cls: "active" } };
//onItemAppended($item, item)

module Common {

	export class ListGenerator {
		
		public clearCont = false;
		public $cont;
		public itemTemplateName: string;
		public eventHandlers: EventHandler[];
		public customMapping = null;
		public appendStyle = "append";
		public isAsync = false;

		public listLimit = 0;
		public listLimitMoreTmp = "";
		public listLimitLessTmp = "";
		public listLimitLast = true;
		private hidableIdClass;
			
		private itemTemplate;
		public emptyTemplate;

		static get v(): Views.ViewBase {
        return Views.ViewBase.currentView;
    }

		constructor() {
			this.hidableIdClass = `hidable-${Views.ViewBase.currentView.makeRandomString()}`;
		}
		
		public onItemAppended: Function;

		private $items = [];
			
		public static init($cont, itemTemplateName): ListGenerator {
			var lg = new ListGenerator();
				
			lg.$cont = $cont;
			lg.itemTemplateName = itemTemplateName;
			lg.eventHandlers = [];
				
			lg.itemTemplate = this.v.registerTemplate(lg.itemTemplateName);

			return lg;
		}

		

		public destroy() {
				this.$items.forEach(($i) => {
					$i.remove();
				});
		}

		public evnt(selector: string, handler: Function): EventHandler {
			var eh = new EventHandler(selector, handler);
			this.eventHandlers.push(eh);

			return eh;
		}

		public generateList(items) {

			if (this.clearCont) {
				this.$cont.empty();
			}

			if (items.length === 0) {

				if (this.emptyTemplate) {
					var t = ListGenerator.v.registerTemplate(this.emptyTemplate);
					var $t = $(t());

					this.$cont.html($t);

					this.$items.push($t);
				}

				return;
			}
				
			var by = 10;
			if (this.isAsync && (items.length > by)) {

				var to = by;
				var max = items.length - 1;
				for (var i = 0; i <= max; i = i + by) {

					if (to > max) {
						to = max + 1;
					}
						
					var index = i / by;

					this.genItemsChunkTime(i, index, items.slice(i, to));

					to = to + by;
				}
			} else {
					this.genItemsChunk(0, items);	
			}				
		}

		private genItemsChunkTime(startNo, chunkNo, items) {
			setTimeout(() => {
					this.genItemsChunk(startNo, items);
				},
				500 * chunkNo);
		}

		private genItemsChunk(startNo, items) {
			var itemNo = startNo;

			var hidable = this.isHidable(items);

			items.forEach((item) => {
				var $item = this.generateItem(item);
				this.$items.push($item);
				$item.data("no", itemNo);

				if (hidable) {
					this.hidableFnc(itemNo, $item, items);
				}

				itemNo++;
			});
		}

		private isHidable(items) {
			if (this.listLimit === 0) {
				return false;
			}
				
			return items.length > this.getListLimit();
		}

		public activeItem: Function;

			private getListLimit() {
					var l = this.listLimitLast ? this.listLimit + 1 : this.listLimit;
					return l;
			}

			private $expander;
			private $collapser;

		private hidableFnc(itemNo, $item, items) {
			var limit = this.getListLimit();
			if (itemNo + 1 === limit) {
				var t = ListGenerator.v.registerTemplate(this.listLimitMoreTmp);
				this.$expander = $(t());
				this.$expander.click((e) => {
					e.preventDefault();						
					this.toggleHidingCls(true);
				});
				this.$cont.append(this.$expander);
			}

			if (itemNo + 1 > limit) {
				$item.addClass(this.hidableIdClass);
				$item.addClass("hidable-hide");
			}

			var isLast = itemNo + 1 === items.length;
			if (isLast) {
					var tl = ListGenerator.v.registerTemplate(this.listLimitLessTmp);
					this.$collapser = $(tl());
					this.$collapser.click((e) => {
							e.preventDefault();							
							this.toggleHidingCls(false);
					});
					this.$cont.append(this.$collapser);

					this.$collapser.addClass("hidden");

				this.toggleHidingCls(false);
			}
		}
			
		private toggleHidingCls(state) {
				var $hs = this.$cont.find(`.${this.hidableIdClass}`);

			if (state) {
				this.$cont.removeClass("list-state-collapsed");
				this.$cont.addClass("list-state-expanded");

				this.$collapser.removeClass("hidden");
				this.$expander.addClass("hidden");

				$hs.removeClass("hidable-hide");
			} else {					
				this.$cont.addClass("list-state-collapsed");
				this.$cont.removeClass("list-state-expanded");

				this.$collapser.addClass("hidden");
				this.$expander.removeClass("hidden");

				$hs.addClass("hidable-hide");
			}
		}

		private generateItem(item) {

			var context = item;
			if (this.customMapping) {
				context = this.customMapping(item);
			}

			var $item = $(this.itemTemplate(context));

				if (this.activeItem) {
						var actItemRes = this.activeItem(item);
						if (actItemRes.isActive) {
							$item.addClass(actItemRes.cls);
						}
				}

				this.eventHandlers.forEach((eh) => {

					var $i = $item;
					if (eh.selector) {
						$i = $item.find(eh.selector);
					}
						
					$i.on(eh.event, (e) => {
						e.preventDefault();

						var $target = $(e.delegateTarget);

						eh.handler(e, $item, $target, item);
					});
				});

			if (this.appendStyle === "append") {
				this.$cont.append($item);
			} else if (this.appendStyle === "prepend") {
				this.$cont.prepend($item);
			} else if (this.appendStyle === "after") {
				this.$cont.after($item);
			} else if (this.appendStyle === "before") {
					this.$cont.before($item);
			}

			if (this.onItemAppended) {
				this.onItemAppended($item, item);
			}

			return $item;
		}			
	}


	export class EventHandler {
		constructor(selector: string, handler: Function) {
			this.selector = selector;
			this.handler = handler;
		}

		public selector;
		public handler: Function;
		public event = "click";

		public setEvent(event) {
			this.event = event;
			return this;
		}
	}
}