
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

module Views {

	export class ViewBase {
	 
	 public googleInit: GoogleInit;
	 
	 constructor() {				
		this.initializeFacebook();

		this.googleInit = new GoogleInit();
	 }



	 public initializeFacebook() {

		var fbInit = new FacebookInit();
		 fbInit.onFacebookInitialized = () => {
			 this.onFacebookInitialized();
		 }

		fbInit.initialize();		
	 }

	 onFacebookInitialized() {
		//this happens when fb is initialized, it checks if user is already paired with this app		
		FB.getLoginStatus(this.statusChangeCallback);
	 }

	 onFacebookButtonPressed() {
		//this happends when app is authorized over the button
		FB.getLoginStatus(this.statusChangeCallback);
	 }
	 
		private statusChangeCallback = (response) => {
			if (response.status === 'connected') {
				this.onFacebookConnected(response.authResponse);
			} else if (response.status === 'not_authorized') {
				//this.config.onFacebookNotAuthorized();
			} else {
				//this.config.onFacebookNotLogged();
			}
	 }


		onFacebookConnected(authResponse) {

		 var facebookUser = new CreateUserFacebook();
		 facebookUser.handleRoughResponse(authResponse);
		}

		//		googleInit.onSuccess = function onSuccess(googleUser) {

	//			var dbgStr = 'Logged in as: ' + googleUser.getBasicProfile().getName();
	//			console.log(dbgStr);
	//			alert(dbgStr);
	//			currentView.googleUserLogged(googleUser);
	//		}

	//		function renderButton() {
	//googleInit.renderButton();
 //}

		public apiGet(endpointName: string, params: string[][], callback: Function) {

			var endpoint = '/api/' + endpointName;

			var request = new RequestSender(endpoint, null, true);
			request.params = params;
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendGet();
	 }

		public apiPost(endpointName: string, data: any, callback: Function) {

		 var endpoint = '/api/' + endpointName;

		 var request = new RequestSender(endpoint, data, true);		 
		 request.serializeData();
		 request.onSuccess = callback;
		 request.onError = response => { alert('error') };
		 request.sentPost();
		}
	 



	}
}
