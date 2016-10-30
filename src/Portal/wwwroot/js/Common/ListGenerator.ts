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
			
		private itemTemplate;

		public onItemAppended: Function;
			
		public static init($cont, itemTemplateName): ListGenerator {
			var lg = new ListGenerator();
				
			lg.$cont = $cont;
			lg.itemTemplateName = itemTemplateName;
			lg.eventHandlers = [];

			lg.itemTemplate = Views.ViewBase.currentView.registerTemplate(lg.itemTemplateName);

			return lg;
		}

		

		//todo: itemCont 

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
				$item.data("no", itemNo);
				itemNo++;
			});
		}


		private generateItem(item) {

			var context = item;
			if (this.customMapping) {
				context = this.customMapping(item);
			}

			var $item = $(this.itemTemplate(context));

			this.eventHandlers.forEach((eh) => {
				$item.find(eh.selector).on(eh.event, (e) => {
					e.preventDefault();

					var $target = $(e.target);

					eh.handler(e, $item, $target);
				});
			});

			this.$cont.append($item);

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