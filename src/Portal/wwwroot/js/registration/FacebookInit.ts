module	Reg {
	export class FacebookInit {
	 
		public static onInitialized = [];

		private static initCalled = false;
	  private static initialized = false;

		public initialize(callback) {

			if (FacebookInit.initCalled) {
				if (FacebookInit.initialized) {
					callback();
				} else {
					FacebookInit.onInitialized.push(callback);
				}
				return;
			} else {
				FacebookInit.initCalled = true;
				FacebookInit.onInitialized.push(callback);
			}
		 
			$.ajaxSetup({ cache: true });
			$.getScript("//connect.facebook.net/en_US/sdk.js", () => {
				FB.init({
					appId: document["facebookId"],
					cookie: true, // enable cookies to allow the server to access the session
					xfbml: true, // parse social plugins on this page
					version: 'v2.5'
				});

				FacebookInit.initialized = true;
				FacebookInit.onInitialized.forEach((f) => { f(); });
			});

		}
	}
}