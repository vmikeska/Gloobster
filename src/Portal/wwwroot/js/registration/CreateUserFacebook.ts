class CreateUserFacebook extends CreateUserBase {

 constructor() {
	 super();
	 this.loginType = NetworkType.Facebook;
 }

	endpoint = "/api/FacebookUser";

	registerOrLogin() {
	 FB.getLoginStatus(this.statusChangeCallback);
	}

	public statusChangeCallback = (response) => {
		if (response.status === "connected") {
			this.handleRoughResponse(response.authResponse);
		} else if (response.status === "not_authorized") {
			//possibly problems with authorization
		} else {
			//zero state
		}
	}

	handleRoughResponse(jsonRequest) {

		var fbUser = new FacebookUser(
			jsonRequest.accessToken,
			jsonRequest.userID,
			jsonRequest.expiresIn,
			jsonRequest.signedRequest);

		super.sendUserRegistrationData(fbUser);
	}

 login() {
	 FB.login(this.statusChangeCallback, { scope: 'email,user_tagged_places,publish_actions,user_location,user_hometown'});
 }

}

class FacebookUser {
 constructor(accessToken: string, userId: string, expiresIn: number, signedRequest: string) {
	this.accessToken = accessToken;
	this.userId = userId;
	this.expiresIn = expiresIn;
	this.signedRequest = signedRequest;
 }

 accessToken: string;
 userId: string;
 expiresIn: number;
 signedRequest: string;
}