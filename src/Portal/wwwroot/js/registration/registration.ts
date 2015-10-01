
//interface ICreateUser {		
// sendUserRegistrationData: Function;
// storeCookieWithToken(token: string);
// createUserEndpoint: string;
//}
//implements ICreateUser


enum NetworkType {
	Local, Facebook, Twitter, Google
}

class CreateUserBase {

	createUserEndpoint = '';

	loginType: NetworkType;

	onSuccess = (response) => {
	 this.storeCookieWithToken(response.encodedToken);
	}

	onError = (response) => {
	 //todo: show some general error dialog
	}


	storeCookieWithToken(token: string) {	 
	 $.cookie("token", token);
		console.log("token received: " + this.loginType);
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