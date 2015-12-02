module Reg {
	export class LoginManager {

		cookieLogin: CookieLogin;
		cookieManager: Common.CookieManager;

		constructor() {
		 this.cookieManager = new Common.CookieManager();
			this.loadCookies();

			if (!this.isAlreadyLogged()) {
				this.facebookUserCreator = new CreateUserFacebook();
				this.googleUserCreator = new CreateUserGoogle();
				this.localUserCreator = new CreateUserLocal();

			}
			this.twitterUserCreator = new CreateUserTwitter();
		}

		public facebookUserCreator: CreateUserFacebook;
		public googleUserCreator: CreateUserGoogle;
		public localUserCreator: CreateUserLocal;
		public twitterUserCreator: CreateUserTwitter;

		public loadCookies() {
			this.cookieLogin = this.cookieManager.getJson(Constants.cookieName);
		}

		public isAlreadyLogged() {
			if (this.cookieLogin) {
				return true;
			}

			return false;
		}

		public logout() {

			this.cookieManager.removeCookie(Constants.cookieName);

			if (this.cookieLogin.networkType === NetworkType.Facebook) {
				FB.getLoginStatus(() => {
					FB.logout(() => {
						window.location.href = "/";
					});
				});

			} else {
				window.location.href = "/";
			}

		}


	}

	export class CookieLogin {
		public encodedToken: string;
		public networkType: NetworkType;
	}

}