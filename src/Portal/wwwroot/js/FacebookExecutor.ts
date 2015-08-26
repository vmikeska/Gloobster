class FacebookLoginExecutor {

		public fbLogin: FacebookLogin;
		public fbInit: FacebookInit;

		public execute() {				
								
				var onFacebookConnected = function (authResponse) {

						var facebookUser = new CreateUserFacebook();
						facebookUser.handleRoughResponse(authResponse);


						FB.api('/me', function (response) {
								var strResponse = JSON.stringify(response);
							$('#status').html(strResponse);
						});
				}
        
				//this.fbLogin = new FacebookLogin(loginConfig);			
				this.fbLogin = new FacebookLogin();
				this.fbLogin.onFacebookConnected = onFacebookConnected;

				this.fbInit = new FacebookInit(this.fbLogin.refreshLoginStatus);
				
				window['fbAsyncInit'] = this.fbInit.asyncInit;
        this.fbInit.sdkLoad(document);

		}
}



