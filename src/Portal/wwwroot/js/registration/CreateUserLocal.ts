module Reg {
	export class CreateUserLocal extends CreateUserBase {

		constructor() {
			super();
			this.loginType = NetworkType.Base;
		}

		endpoint = "/api/User";

		registerOrLogin(mail: string, password: string) {
			var baseUser = new PortalUser();
			baseUser.mail = mail;
			baseUser.password = password;

			super.sendUserRegistrationData(baseUser);
		}
	}

	export class PortalUser {
		password: string;
		mail: string;
	}
}