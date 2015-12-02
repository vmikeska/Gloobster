
module Views {

	export enum PageType {HomePage, PinBoard, TripList, TwitterAuth, Friends}

	export class ViewBase {

	  public static currentView: ViewBase;

		public loginManager: Reg.LoginManager;
		public cookieManager: Common.CookieManager;

		get pageType(): PageType { return null; }

		constructor() {
			ViewBase.currentView = this;
			this.cookieManager = new Common.CookieManager();
			this.loginManager = new Reg.LoginManager();

			var isAlreadyLogged = this.loginManager.isAlreadyLogged();
			if (!isAlreadyLogged) {
				this.initializeGoogle();
				this.initializeFacebook();
				$("#loginSection").show();
			} else {
				console.log("isAlreadyLogged with " + this.loginManager.cookieLogin.networkType);

				if (this.loginManager.cookieLogin.networkType === Reg.NetworkType.Facebook) {
					this.initializeFacebook();
				}
			}
		}


		private initializeGoogle() {
			var self = this;

			var btnGoogle = new Reg.GoogleButton();
			btnGoogle.successfulCallback = (googleUser) => {
				self.loginManager.googleUserCreator.registerOrLogin(googleUser);
			};

			var btnName = (this.pageType === PageType.HomePage) ? "googleLoginBtnHome" : "googleLoginBtn";
			btnGoogle.elementId = btnName;
			btnGoogle.initialize();
		}

		private initializeFacebook() {
			var self = this;

			var fbInit = new Reg.FacebookInit();

			fbInit.onFacebookInitialized = () => {
				self.loginManager.facebookUserCreator.registerOrLogin();
			}

			fbInit.initialize();
		}


		public apiGet(endpointName: string, params: string[][], callback: Function) {

			var endpoint = '/api/' + endpointName;
			console.log("getting: " + endpoint);

			var request = new Common.RequestSender(endpoint, null, true);
			request.params = params;
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendGet();
		}

		public apiPost(endpointName: string, data: any, callback: Function) {

			var endpoint = '/api/' + endpointName;
			console.log("posting: " + endpoint);

			var request = new Common.RequestSender(endpoint, data, true);
			request.serializeData();
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendPost();
		}

		public apiPut(endpointName: string, data: any, callback: Function) {

			var endpoint = '/api/' + endpointName;
			console.log("putting: " + endpoint);

			var request = new Common.RequestSender(endpoint, data, true);
			request.serializeData();
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendPut();
		}

		public apiDelete(endpointName: string, params: string[][], callback: Function) {

			var endpoint = '/api/' + endpointName;
			console.log("deleting: " + endpoint);

			var request = new Common.RequestSender(endpoint, null, true);
			request.params = params;
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendDelete();
		}

		public registerTemplate(name: string) {
		 var source = $("#" + name).html();
		 return Handlebars.compile(source);
		}

	}
}
