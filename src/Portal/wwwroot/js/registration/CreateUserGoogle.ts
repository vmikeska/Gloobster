class CreateUserGoogle extends CreateUserBase {

	//todo: rename
	createUserEndpoint = '/api/GoogleUser';

	registerOrLogin(googleUser) {		
	 super.sendUserRegistrationData(googleUser);
	}
 	
}