module Reg {
	export class CreateUserTwitter extends CreateUserBase {

		constructor() {
			super();
			this.loginType = NetworkType.Twitter;
		}

		endpoint = "/api/TwitterUser";

		handleRoughResponse(twUser) {

			super.sendUserRegistrationData(twUser);
		}


	}
}