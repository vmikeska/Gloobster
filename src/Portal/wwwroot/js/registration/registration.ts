
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



class CreateUserBase implements ICreateUser {

	createUserEndpoint = 'notImpolemented';

	onSuccess = (response) => {
	 this.storeCookieWithToken(response.encodedToken);
	}

	onError = (response) => {
	 //todo: show some general error dialog
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

class CreateUserLocal extends CreateUserBase {

		createUser(displayName: string, mail: string, password: string) {
				var baseUser = new PortalUser();
				baseUser.displayName = displayName;
				baseUser.mail = mail;
				baseUser.password = password;

				super.sendUserRegistrationData(baseUser);
		}
}

