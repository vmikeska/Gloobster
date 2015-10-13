
class LoginManager {

	cookieLogin: CookieLogin;

	constructor() {
		this.loadCookies();

		if (!this.isAlreadyLogged()) {
			this.facebookUserCreator = new CreateUserFacebook();
			this.googleUserCreator = new CreateUserGoogle();
			this.localUserCreator = new CreateUserLocal();
		}
	}

	public facebookUserCreator: CreateUserFacebook;
	public googleUserCreator: CreateUserGoogle;
	public localUserCreator: CreateUserLocal;

	public loadCookies() {
		var cookieLogStr = $.cookie(Constants.cookieName);

		if (!cookieLogStr.startsWith("{")) {
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

	public logout() {

		$.cookie(Constants.cookieName, {}, { path: '/' });
		window.location.href = "/";
	}


}

class CookieLogin {
 public encodedToken: string;
 public networkType: string;
}

