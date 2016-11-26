module Common {

	export class ListGenerator {
		
		public clearCont = false;
		public $cont;
		public itemTemplateName: string;
		public eventHandlers: EventHandler[];
		public customMapping = null;
		public appendStyle = "append";
		public isAsync = false;
			
		private itemTemplate;
		public emptyTemplate;

		static get v(): Views.ViewBase {
        return Views.ViewBase.currentView;
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
					items.forEach((item) => {
							var $item = this.generateItem(item);
							this.$items.push($item);
							$item.data("no", itemNo);
							itemNo++;
					});
			}

			public activeItem: Function;

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