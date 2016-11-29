module Planning {
		
	export class CustomPageSetter implements IPageSetter {


		private v: Views.FlyView;

		private customForm: CustomFrom;


		constructor(v: Views.FlyView) {
			this.v = v;
		}

		public setConnections(conns) {

		}
			
		public init(callback: Function) {
				this.customForm = new CustomFrom(this.v);
				this.customForm.init(() => {
					callback();
				});				
		}

		public getCustomId() {
			return this.customForm.searchId;
		}

		
	}


}