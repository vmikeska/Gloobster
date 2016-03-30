module Reg {

	export class GoogleButton {

		public elementId: string;
		public buttonsSelector: string;
		public successfulCallback: Function;

		private auth2: any;

		private config = {
			//todo: to constants
			client_id: "430126253289-14tdcfe4noqm6p201jrugpi9dsies2at.apps.googleusercontent.com",
			cookiepolicy: "single_host_origin"
			// Request scopes in addition to 'profile' and 'email'
			//scope: 'additional_scope'
		};

	
		public initialize(elementId) {
			this.elementId = elementId;
			gapi.load("auth2", () => { this.onLoaded(); });
		}
		
		// Retrieve the singleton for the GoogleAuth library and set up the client.
		private onLoaded() {
			if (this.auth2) {
				return;
			}
			console.log("onLoaded");

			this.auth2 = gapi.auth2.init(this.config);
			
			var element = document.getElementById(this.elementId);

			if (element) {
				this.attachSignin(element);
			}
		}

		private errorHandler(error) {
			//todo: do something here ?
			alert(JSON.stringify(error, undefined, 2));
		}

		private attachSignin(element) {
			this.auth2.attachClickHandler(element, {}, this.successfulCallback, this.errorHandler);
		}

	}
}