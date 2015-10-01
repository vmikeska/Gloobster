class CreateUserGoogle extends CreateUserBase {

 constructor() {
	 super();
	 this.loginType = NetworkType.Google;	 
 }

	

	//todo: rename
	createUserEndpoint = '/api/GoogleUser';

	registerOrLogin(googleUser) {		
	 super.sendUserRegistrationData(googleUser);
	}
 	
}