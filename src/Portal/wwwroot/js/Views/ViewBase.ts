module Views {
 
 export enum PageType {HomePage, PinBoard, TripList, TwitterAuth}

	export class ViewBase {

		public loginManager: LoginManager;

		get pageType(): PageType { return null; }


		constructor() {		 
		 this.loginManager = new LoginManager();
			
			var isAlreadyLogged = this.loginManager.isAlreadyLogged();			
			if (!isAlreadyLogged) {
				this.initializeGoogle();
				this.initializeFacebook();
				$("#loginSection").show();
			} else {
			 console.log("isAlreadyLogged with " + this.loginManager.cookieLogin.networkType);								

			 if (this.loginManager.cookieLogin.networkType === NetworkType.Facebook) {
				this.initializeFacebook();
			 }

			 //todo: delete when testing is over
			 $("#loginSection").show();
			}
		}

		private initializeGoogle() {		 
		 var self = this;
		 
			var btnGoogle = new GoogleButton();
			btnGoogle.successfulCallback = (googleUser) => {
			 self.loginManager.googleUserCreator.registerOrLogin(googleUser);			 
			};

			var btnName = (this.pageType === PageType.HomePage) ? "googleLoginBtnHome" : "googleLoginBtn";
			btnGoogle.elementId = btnName;
			btnGoogle.initialize();
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
