module Reg {
	export class FacebookAuth {

		private endpoint = "/api/FacebookUser";

		public onSuccessful: Function;

		public login() {
			FB.login(this.statusChangeCallback, { scope: 'publish_actions,user_location,user_hometown,user_friends,email' });
		}

		registerOrLogin() {
			FB.getLoginStatus(this.statusChangeCallback);
		}

		private statusChangeCallback = (response) => {
			if (response.status === "connected") {
				this.handleRoughResponse(response.authResponse);
			} else if (response.status === "not_authorized") {
				//possibly problems with authorization
			} else {
				//this.login();
			}
		}

		private handleRoughResponse(jsonRequest) {

			var fbUser = new FacebookUser();
			fbUser.accessToken = jsonRequest.accessToken;
			fbUser.userId = jsonRequest.userID;
			fbUser.expiresIn = jsonRequest.expiresIn;
			fbUser.signedRequest = jsonRequest.signedRequest;

			if (this.onSuccessful) {
				this.onSuccessful(fbUser);
			}
		}
	 
	}

	export class FacebookUser {
	 accessToken: string;
	 userId: string;
	 expiresIn: number;
	 signedRequest: string;
	}
}