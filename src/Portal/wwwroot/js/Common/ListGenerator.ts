module Common {

		export class ListGeneratorTest {
		
			public test(myItems) {
					
				var lg = ListGenerator.init($("#theCont"), "myItem-template");
					
				lg.customMapping = (item) => {
					return {
						 asdf: item.a, 
						 asddd: item.b
					};
				}
				
				lg.evnt($(".delete"), (e, $item, $target) => {
					//do something, like delete the thing
				});

				lg.evnt($(".add"), (e, $item, $target) => {
					//do something, like delete the thing
				});

				lg.generateList(myItems);
				//todo: maybe cont at custom time
			}

	}


	export class ListGenerator {
		
		public clearCont = false;
		public $cont;
		public itemTemplateName: string;
		public eventHandlers: EventHandler[];
		public customMapping = null;
		public appendStyle = "append";
			
		private itemTemplate;

		public onItemAppended: Function;

		private $items = [];
			
		public static init($cont, itemTemplateName): ListGenerator {
			var lg = new ListGenerator();
				
			lg.$cont = $cont;
			lg.itemTemplateName = itemTemplateName;
			lg.eventHandlers = [];

			lg.itemTemplate = Views.ViewBase.currentView.registerTemplate(lg.itemTemplateName);

			return lg;
		}

		

		public destroy() {
				this.$items.forEach(($i) => {
					$i.remove();
				});
		}

		public evnt(selector: string, handler: Function) {
			this.eventHandlers.push(new EventHandler(selector, handler));
		}

		public generateList(items) {

			if (this.clearCont) {
				this.$cont.empty();
			}

			var itemNo = 0;
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
	}
}