class FacebookLoginConfig {
		onFacebookConnected: Function;
		onFacebookNotAuthorized: Function;
		onFacebookNotLogged: Function;
}


class FacebookLogin {

		private config: FacebookLoginConfig;

		public onFacebookConnected: Function;

		constructor() {				
				//config: FacebookLoginConfig
				//this.config = config;
		}		

    // Logged into your app and Facebook.
		//  public onFacebookConnected(response: any) {
		//		this.config.onFacebookConnected(response);
		//}

    // The person is logged into Facebook, but not your app.
    public onFacebookNotAuthorized() {
				this.config.onFacebookNotAuthorized();
		}

    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    public onFacebookNotLogged() {
				this.config.onFacebookNotLogged();
		}

		public refreshLoginStatus = () => {
        FB.getLoginStatus(this.statusChangeCallback);
    };

    private statusChangeCallback = (response) => {
        if (response.status === 'connected') {
            //this.config.onFacebookConnected(response.authResponse);
						this.onFacebookConnected(response.authResponse);
        } else if (response.status === 'not_authorized') {
            this.config.onFacebookNotAuthorized();
        } else {
            this.config.onFacebookNotLogged();
        }
    }



}


