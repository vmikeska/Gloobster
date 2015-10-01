class CreateUserFacebook extends CreateUserBase {

	//todo: rename
	createUserEndpoint = '/api/FacebookUser';

	registerOrLogin() {
		FB.getLoginStatus(this.statusChangeCallback);
	}

	private statusChangeCallback = (response) => {
		if (response.status === 'connected') {
			this.handleRoughResponse(response.authResponse);
		} else if (response.status === 'not_authorized') {
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