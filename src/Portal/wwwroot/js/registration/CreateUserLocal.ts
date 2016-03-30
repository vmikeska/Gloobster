module Reg {
	export class CreateUserLocal extends CreateUserBase {

		constructor() {
			super();
			//this.loginType = NetworkType.Base;			
		}

		endpoint = "/api/User";

		registerOrLogin(mail: string, password: string, action: UserActionType) {
			var baseUser = new PortalUser();
			baseUser.mail = mail;
			baseUser.password = password;
			baseUser.action = action;

			//super.sendUserRegistrationData(baseUser);
		}
	}

	export class PortalUser {
		password: string;
		mail: string;
		action: UserActionType;
	}
}