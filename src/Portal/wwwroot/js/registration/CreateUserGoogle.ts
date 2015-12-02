module Reg {
	export class CreateUserGoogle extends CreateUserBase {

		constructor() {
			super();
			this.loginType = NetworkType.Google;
		}

		endpoint = "/api/GoogleUser";

		registerOrLogin(googleUser) {
			super.sendUserRegistrationData(googleUser);
		}

	}
}