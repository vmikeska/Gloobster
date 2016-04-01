module Reg {

	export class LoginButtonsManager {

		public initialize(fb, google, twitter) {

			var fbBtn = new FacebookButtonInit(fb);
			var googleBtn = new GoogleButtonInit(google);
			var twitterBtn = new TwitterButtonInit(twitter);

		}
	}

	export class AuthCookieSaver {

		private cookiesMgr: Common.CookieManager;

		constructor() {
			this.cookiesMgr = new Common.CookieManager();
		}

		public saveCookies(res) {
			this.cookiesMgr.setString(Constants.tokenCookieName, res.Token);
			this.cookiesMgr.setString(Constants.nameCookieName, res.DisplayName);

			//alert("TestOk: " + JSON.stringify(res));

			//todo: implement
			//this.cookiesMgr.setString(Constants.socNetsCookieName, );

			//todo: remove ?
			//this.cookiesMgr.setString(, res.UserId);
		}
	}

	export class TwitterButtonInit {
	 
		constructor(btn) {		 		
			var $btn = $(`#${btn}`);
			$btn.click((e) => {
				e.preventDefault();
				this.twitterAuthorize();
			});
		}

		public twitterAuthorize() {
		//this.twitterLoginWatch();
		var url = '/TwitterUser/Authorize';
		var wnd = window.open(url, "Twitter authentication", "height=500px,width=400px");
	 }

	 private twInterval = null;

	 //private twitterLoginWatch() {
		//this.twInterval = setInterval(() => {
		// var cookieVal = this.cookieManager.getJson(Constants.cookieName);
		// if (cookieVal) {
		//	clearInterval(this.twInterval);
		//	window.location.href = Constants.firstRedirectUrl;
		// }
		// console.log("checking: " + JSON.stringify(cookieVal));
		//}, 500);
	 //}
	}

	export class GoogleButtonInit {

		private cookiesSaver: AuthCookieSaver;

		constructor(btnId) {
			this.cookiesSaver = new AuthCookieSaver();
			this.initialize(btnId);
		}

		private initialize(btnId) {
			var btnGoogle = new GoogleButton();
			btnGoogle.successfulCallback = (googleUser) => {
				var data = googleUser;
				Views.ViewBase.currentView.apiPost("GoogleUser", data, (r) => {
					this.cookiesSaver.saveCookies(r);
					//unload sdk ?
				});
			};

			btnGoogle.initialize(btnId);
		}
	}

	export class FacebookButtonInit {

	 private cookiesSaver: AuthCookieSaver;

	 constructor(btnId) {
			this.cookiesSaver = new AuthCookieSaver();
			this.registerFacebookButton(btnId);
		}

		private registerFacebookButton(btnId) {

			var $btn = $(`#${btnId}`);

			this.initializeFacebookSdk(() => {
				$btn.click((e) => {
					e.preventDefault();
					var auth = new FacebookAuth();
					auth.onSuccessful = (user) => {
						var data = user;
						Views.ViewBase.currentView.apiPost("FacebookUser", data, (r) => {
							this.cookiesSaver.saveCookies(r);
							//unload sdk ?
						});
					};
					auth.login();
				});
			});
		}

		private initializeFacebookSdk(callback) {
			var fbInit = new FacebookInit();

			fbInit.onFacebookInitialized = () => {
				console.log("fb initialized");
				callback();				
			}

			fbInit.initialize();

		}
	}
}