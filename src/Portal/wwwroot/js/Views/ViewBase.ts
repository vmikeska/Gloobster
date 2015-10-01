module Views {

	export class ViewBase {

	 public facebookUserCreator: CreateUserFacebook;
	 public googleUserCreator: CreateUserGoogle;

		public googleInit: GoogleInit;

		constructor() {
			this.initializeFacebook();
			this.initializeGoogle();
		}

		private initializeGoogle() {		 
		 this.googleInit = new GoogleInit();

			
		 this.googleInit.onSuccess = (googleUser) => {
			this.googleUserCreator.registerOrLogin(googleUser);
		 }

		 this.googleInit.onFailure = (error) => {
			 //todo: display general dialog
		 }

		}

		private initializeFacebook() {
			var self = this;

			this.facebookUserCreator = new CreateUserFacebook();

			var fbInit = new FacebookInit();
			
			fbInit.onFacebookInitialized = () => {
			 self.facebookUserCreator.registerOrLogin();
			}

			fbInit.initialize();
		}

	 

		//		googleInit.onSuccess = function onSuccess(googleUser) {

		//			var dbgStr = 'Logged in as: ' + googleUser.getBasicProfile().getName();
		//			console.log(dbgStr);
		//			alert(dbgStr);
		//			currentView.googleUserLogged(googleUser);
		//		}

		//		function renderButton() {
		//googleInit.renderButton();
		//}

		public apiGet(endpointName: string, params: string[][], callback: Function) {

			var endpoint = '/api/' + endpointName;

			var request = new RequestSender(endpoint, null, true);
			request.params = params;
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendGet();
		}

		public apiPost(endpointName: string, data: any, callback: Function) {

			var endpoint = '/api/' + endpointName;

			var request = new RequestSender(endpoint, data, true);
			request.serializeData();
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sentPost();
		}


	}
}
