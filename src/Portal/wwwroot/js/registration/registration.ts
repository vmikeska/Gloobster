
interface ICreateUser {		
 sendUserRegistrationData: Function;
 storeCookieWithToken(token: string);
 createUserEndpoint: string;
}

class PortalUser {
		displayName: string;
    password: string;
    mail: string;
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

class CreateUserBase implements ICreateUser {

	createUserEndpoint = 'notImpolemented';

	onSuccess = (response) => {
	 this.storeCookieWithToken(response.encodedToken);
	}

	onError = (response) => {

	}


	storeCookieWithToken(token: string) {	 
	 $.cookie("token", token);
	 //todo: set other stuff, like domain and so
	}

	sendUserRegistrationData(newUser) {
		var request = new RequestSender(this.createUserEndpoint, newUser);
		request.serializeData();
		request.onSuccess = this.onSuccess;
		request.onError = this.onError;
		request.sentPost();
	}
}

class CreateUserGoogle extends CreateUserBase {

	//todo: rename
	createUserEndpoint = '/api/GoogleUser';

		handleRoughResponse(jsonRequest) {

				
				
				super.sendUserRegistrationData(jsonRequest);
		}

}

class CreateUserFacebook extends CreateUserBase {

	//todo: rename
	createUserEndpoint = '/api/FacebookUser';

 handleRoughResponse(jsonRequest) {

	var fbUser = new FacebookUser(
	 jsonRequest.accessToken,
	 jsonRequest.userID,
	 jsonRequest.expiresIn,
	 jsonRequest.signedRequest);

	super.sendUserRegistrationData(fbUser);
 }

}

class CreateUserLocal extends CreateUserBase {

		createUser(displayName: string, mail: string, password: string) {
				var baseUser = new PortalUser();
				baseUser.displayName = displayName;
				baseUser.mail = mail;
				baseUser.password = password;

				super.sendUserRegistrationData(baseUser);
		}
}

