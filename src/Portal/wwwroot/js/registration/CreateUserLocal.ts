class CreateUserLocal extends CreateUserBase {

	createUser(displayName: string, mail: string, password: string) {
		var baseUser = new PortalUser();
		baseUser.displayName = displayName;
		baseUser.mail = mail;
		baseUser.password = password;

		super.sendUserRegistrationData(baseUser);
	}
}

class PortalUser {
 displayName: string;
 password: string;
 mail: string;
}