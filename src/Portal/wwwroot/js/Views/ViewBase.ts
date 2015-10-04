module Views {

	

	export class ViewBase {

		public loginManager: LoginManager;

		public googleInit: GoogleInit;

		constructor() {
		 this.loginManager = new LoginManager;

			var useCookie = true;
			var isAlreadyLogged = this.loginManager.isAlreadyLogged() && useCookie;
			if (isAlreadyLogged) {
				console.log("isAlreadyLogged with " + this.loginManager.cookieLogin.networkType);
			}

			if (!isAlreadyLogged) {
				this.initializeGoogle();
				this.initializeFacebook();
			}
		}

		private initializeGoogle() {
			var self = this;
		 
			this.googleInit = new GoogleInit();
		 
			this.googleInit.onSuccess = (googleUser) => {
			 self.loginManager.googleUserCreator.registerOrLogin(googleUser);
			}

			this.googleInit.onFailure = (error) => {
				//todo: display general dialog
			}
		}

		private initializeFacebook() {
			var self = this;
		 
			var fbInit = new FacebookInit();

			fbInit.onFacebookInitialized = () => {
			 self.loginManager.facebookUserCreator.registerOrLogin();
			}

			fbInit.initialize();
		}

		public apiGet(endpointName: string, params: string[][], callback: Function) {

			var endpoint = '/api/' + endpointName;
			console.log("getting: " + endpoint);

			var request = new RequestSender(endpoint, null, true);
			request.params = params;
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendGet();
		}

		public apiPost(endpointName: string, data: any, callback: Function) {

			var endpoint = '/api/' + endpointName;
			console.log("posting: " + endpoint);

			var request = new RequestSender(endpoint, data, true);
			request.serializeData();
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sentPost();
		}


	}
}
