
class LoginManager {

		cookieLogin: CookieLogin;

		constructor() {
			this.loadCookies();

			if (!this.isAlreadyLogged()) {
				this.facebookUserCreator = new CreateUserFacebook();
				this.googleUserCreator = new CreateUserGoogle();
			}
		}

		public facebookUserCreator: CreateUserFacebook;
		public googleUserCreator: CreateUserGoogle;

		public loadCookies() {
		 var cookieLogStr = $.cookie(Constants.cookieName);			
			
			if ($.isEmptyObject(cookieLogStr)) {
				return;
			}

			var cookieLogObj = JSON.parse(cookieLogStr);

			this.cookieLogin = new CookieLogin();
			this.cookieLogin.encodedToken = cookieLogObj.encodedToken;
			this.cookieLogin.networkType = cookieLogObj.networkType;
		}

		public isAlreadyLogged() {
			if (this.cookieLogin) {
				return true;
			}

			return false;
		}
	}

class CookieLogin {
 public encodedToken: string;
 //public status: string;
 public networkType: string;
}

