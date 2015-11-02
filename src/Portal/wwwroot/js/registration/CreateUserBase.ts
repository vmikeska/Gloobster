
class CreateUserBase {

	endpoint = "";

	loginType: NetworkType;
	cookieManager: CookieManager;
 
	constructor() {
		this.cookieManager = new CookieManager();
	}

	onSuccess = (response) => {
		console.log("storing cookie: " + response.encodedToken);

		this.storeCookieWithToken(response.encodedToken, response.networkType);
		$(".popup").hide();
	}

	onError = (response) => {
		//todo: show some general error dialog
	}

	storeCookieWithToken(encodedToken: string, networkType: string) {

		var cookieObj = new CookieLogin();
		cookieObj.encodedToken = encodedToken;
		cookieObj.networkType = parseInt(networkType);
		this.cookieManager.setJson(Constants.cookieName, cookieObj);
	 
		console.log("token received: " + this.loginType);

		if (cookieObj.networkType !== NetworkType.Twitter) {
			window.location.href = Constants.firstRedirectUrl;
		}
	}

	sendUserRegistrationData(newUser) {
		var request = new RequestSender(this.endpoint, newUser);
		request.serializeData();
		request.onSuccess = this.onSuccess;
		request.onError = this.onError;
		request.sendPost();
	}
}

enum NetworkType {
	Facebook, Google, Twitter, Base
}
