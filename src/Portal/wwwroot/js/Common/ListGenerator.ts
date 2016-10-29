module Common {

		export class ListGeneratorTest {
		
			public test(myItems) {
					
				var lg = ListGenerator.init($("#theCont"), "myItem-template");
					
				lg.config.customMapping = (item) => {
					return {
						 asdf: item.a, 
						 asddd: item.b
					};
				}
				
				lg.config.evnt($(".delete"), (e, $item, $target) => {
					//do something, like delete the thing
				});

				lg.config.evnt($(".add"), (e, $item, $target) => {
					//do something, like delete the thing
				});

				lg.generateList(myItems);
				//todo: maybe cont at custom time
			}

	}


	export class ListGenerator {
		
		public config: ListGeneratorConfig; 
			
		private itemTemplate;

		public static init($cont, itemTemplateName): ListGenerator {

			var lg = new ListGenerator();

			lg.config = new ListGeneratorConfig();

			lg.config.$cont = $cont;
			lg.config.itemTemplateName = itemTemplateName;

			lg.itemTemplate = Views.ViewBase.currentView.registerTemplate(lg.config.itemTemplateName);

			return lg;
		}

		public generateList(items) {

			if (this.config.clearCont) {
				this.config.$cont.empty();
			}

			items.forEach((item) => {
				this.generateItem(item);
			});
		}

		private generateItem(item) {
				
			var context = item;
		  if (this.config.customMapping) {
			  context = this.config.customMapping(item);
		  }

			var $item = $(this.itemTemplate(context));

			this.config.eventHandlers.forEach((eh) => {
				eh.$selector.on(eh.event, (e) => {
					e.preventDefault();

					var $target = $(e.target);

					eh.handler(e, $item, $target);
				});
			});

			this.config.$cont.append($item);

		}


	}
		
	export class ListGeneratorConfig {
		
		public clearCont = false;
		public $cont;
		public itemTemplateName: string;
		public eventHandlers: EventHandler[];
		public customMapping = null;

		//todo: itemCont 

		public evnt($selector, handler: Function) {
			this.eventHandlers.push(new EventHandler($selector, handler));
		}
	}

	export class EventHandler {
		constructor($selector, handler: Function) {
			this.$selector = $selector;
			this.handler = handler;
		}

		public $selector;
		public handler: Function;
		public event = "click";
	}
}