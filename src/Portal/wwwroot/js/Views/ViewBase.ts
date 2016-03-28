
module Views {

	export enum PageType {HomePage, PinBoard, TripList, TwitterAuth, Friends}

	export class ViewBase {

	  public static currentView: ViewBase;
	 
		public loginManager: Reg.LoginManager;
		public cookieManager: Common.CookieManager;

	  public onLogin: Function;

		get pageType(): PageType { return null; }

		constructor() {
			ViewBase.currentView = this;
			this.cookieManager = new Common.CookieManager();
			this.loginManager = new Reg.LoginManager();

			var isAlreadyLogged = this.loginManager.isAlreadyLogged();
			if (!isAlreadyLogged) {
				this.initializeGoogle();
				this.initializeFacebook();
				$(".loginSection").show();
			} else {
				console.log("isAlreadyLogged with " + this.loginManager.cookieLogin.networkType);

				if (this.loginManager.cookieLogin.networkType === Reg.NetworkType.Facebook) {
					this.initializeFacebook();
				}

				if (this.onLogin) {
					this.onLogin();
				} 
			}

			this.regUserMenu();
		}

		private regUserMenu() {

		 $("#logoutUser").click((e) => {				
				this.loginManager.logout();				
			});
		}

		public hasSocNetwork(net: Reg.NetworkType) {
		 var netTypesStr = this.cookieManager.getString(Constants.networkTypes);
		 if (!netTypesStr) {
			 return false;
		 }

		 var prms = netTypesStr.split(",");

		 if (net === Reg.NetworkType.Facebook && _.contains(prms, "F")) {
			 return true;
		 }

		 if (net === Reg.NetworkType.Google && _.contains(prms, "G")) {
			return true;
		 }

		 if (net === Reg.NetworkType.Twitter && _.contains(prms, "T")) {
			return true;
		 }

			return false;
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
				console.log("fb initialized");
				self.loginManager.facebookUserCreator.registerOrLogin();
			}

			fbInit.initialize();
		}


		public apiGet(endpointName: string, params: string[][], callback: Function) {

			var endpoint = "/api/" + endpointName;
			console.log("getting: " + endpoint);

			var request = new Common.RequestSender(endpoint, null, true);
			request.params = params;
			request.onSuccess = callback;
			request.onError = response => { alert("error") };
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
