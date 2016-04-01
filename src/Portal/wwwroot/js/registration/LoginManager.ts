module Reg {
	export class LoginManager {

	 public static currentUserId: string;
	 
		cookieLogin: any;
		cookieManager: Common.CookieManager;

		constructor() {
		 this.cookieManager = new Common.CookieManager();
			this.loadCookies();		
		}
	 
		public loadCookies() {
		 this.cookieLogin = this.cookieManager.getString(Constants.tokenCookieName);
		}
	 
		public logout() {

			this.cookieManager.removeCookie(Constants.tokenCookieName);

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
 
}