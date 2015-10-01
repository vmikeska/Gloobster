class FacebookInit {
	

	onFacebookInitialized: Function;

	initialize() {
		window['fbAsyncInit'] = this.asyncInit;
		this.sdkLoad(document);
	}


	sdkLoad(doc) {
		var scriptElementName = 'script';
		var scriptElementId = 'facebook-jssdk';
		var src = "//connect.facebook.net/en_US/sdk.js";

		var isSdkAlreadyLoaded = doc.getElementById(scriptElementId);
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
			appId: '1519189774979242',
			cookie: true, // enable cookies to allow the server to access the session
			xfbml: true, // parse social plugins on this page
			version: 'v2.2'
		});


		this.onFacebookInitialized();

	}
}