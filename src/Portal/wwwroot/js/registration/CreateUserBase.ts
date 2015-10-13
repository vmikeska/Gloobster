
class CreateUserBase {

	endpoint = "";

	loginType: NetworkType;

	onSuccess = (response) => {
	 this.storeCookieWithToken(response.encodedToken, response.networkType);
		$(".popup").hide();
	}

	onError = (response) => {
	 //todo: show some general error dialog
	}


	storeCookieWithToken(encodedToken: string, networkType: string) {

	 var cookieObj = { "encodedToken": encodedToken, "networkType": networkType };
		var cookieStr = JSON.stringify(cookieObj);
		$.cookie(Constants.cookieName, cookieStr);

		var firstRedirectUrl = 'Home/PinBoard';
	 
		console.log("token received: " + this.loginType);

		return;
		window.location.href = firstRedirectUrl;
	}

	sendUserRegistrationData(newUser) {
		var request = new RequestSender(this.endpoint, newUser);
		request.serializeData();
		request.onSuccess = this.onSuccess;
		request.onError = this.onError;
		request.sentPost();
	}
}

enum NetworkType {
	Facebook, Google, Twitter, Base
}

//interface ICreateUser {		
// sendUserRegistrationData: Function;
// storeCookieWithToken(token: string);
// endpoint: string;
//}
//implements ICreateUser



