module Reg {

	export class GoogleButton {

		public elementId: string;
		public buttonsSelector: string;
		public successfulCallback: Function;
		public onBeforeClick: Function;

		private auth2: any;

		private clientId = document["googleId"];

		private config = {			
		  client_id: this.clientId,
			cookiepolicy: "single_host_origin"
			// Request scopes in addition to 'profile' and 'email'
			//scope: 'additional_scope'
		};

	
		public initialize(elementId) {
			this.elementId = elementId;

			gapi.client.setApiKey(this.clientId);
			gapi.load("auth2", () => { this.onLoaded(); });
		}
		
		// Retrieve the singleton for the GoogleAuth library and set up the client.
		private onLoaded() {
			if (this.auth2) {
				return;
			}
			
			this.auth2 = gapi.auth2.init(this.config);
			
			var element = document.getElementById(this.elementId);

			$(element).click((e) => {
			 if (this.onBeforeClick) {
				 this.onBeforeClick();
			 }
			});

			if (element) {
				this.attachSignin(element);
			}
		}

		private errorHandler(error) {
		 var id = new Common.InfoDialog();
		 id.create("Sorry", "Something went wrong :(");
		 console.log("GoogleError: " + JSON.stringify(error, undefined, 2));
		}

		private attachSignin(element) {
			this.auth2.attachClickHandler(element, {}, this.successfulCallback, this.errorHandler);
		}

	}
}