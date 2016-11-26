module Planning {

		export interface IPageSetter {
				setConnections(conns);
				init();
		}

	export class CustomPageSetter implements IPageSetter {

			private formTmp = Views.ViewBase.currentView.registerTemplate("custom-template");
			private v: Views.FlyView;

			constructor(v: Views.FlyView) {
					this.v = v;
			}

		public setConnections(conns) {

		}

		public init() {
			var $tabContent = $("#tabContent");

				var $form = $(this.formTmp());
				$tabContent.html($form);
			//this.planningMap.loadCategory(2);

		}
	}


}