module Reg {
	export class FacebookInit {
	 
		public onFacebookInitialized: Function;

		public initialize() {
			window['fbAsyncInit'] = this.asyncInit;
			this.sdkLoad(document);
		}

		private sdkLoad(doc) {
			var scriptElementName = 'script';
			var scriptElementId = 'facebook-jssdk';
			var src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";

			var scriptElem = doc.getElementById(scriptElementId);
			var isSdkAlreadyLoaded = scriptElem != null;
			if (isSdkAlreadyLoaded) return;

			//create SCRIPT element for SDK
			var js = doc.createElement(scriptElementName);
			js.id = scriptElementId;
			js.src = src;

			//add loaded script before all the previous scripts
			var fjs = doc.getElementsByTagName(scriptElementName)[0];
			fjs.parentNode.insertBefore(js, fjs);
		}
	 
		private asyncInit = () => {			
		 FB.init({
			 appId: document["facebookId"],
			 cookie: true, // enable cookies to allow the server to access the session
			 xfbml: true, // parse social plugins on this page
			 version: 'v2.5'
		 });
		 
			this.onFacebookInitialized();

		}
	}
}