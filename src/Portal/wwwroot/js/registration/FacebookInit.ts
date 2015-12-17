module Reg {
	export class FacebookInit {
	 
		onFacebookInitialized: Function;

		initialize() {
			window['fbAsyncInit'] = this.asyncInit;
			this.sdkLoad(document);
		}

		sdkLoad(doc) {
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

		asyncInit = () => {
			FB.init({
				//appId: '1519189774979242',
				//appId: '1717433995154818',
			 appId: '1733987536832797',
				cookie: true, // enable cookies to allow the server to access the session
				xfbml: true, // parse social plugins on this page
				version: 'v2.5'
			});


			this.onFacebookInitialized();

		}
	}
}