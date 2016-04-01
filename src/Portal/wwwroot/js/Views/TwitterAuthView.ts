module Views {

	export class TwitterAuthView extends ViewBase {

	 private cookiesSaver: Reg.AuthCookieSaver;

		constructor() {
		 super();
		 this.cookiesSaver = new Reg.AuthCookieSaver();
		}

		get pageType(): Views.PageType { return PageType.TwitterAuth; }

		private twInterval = null;

		private onResponse(resp) {
			var data = resp;
			this.apiPost("TwitterUser", data, (r) => {			 
			 this.cookiesSaver.saveCookies(r);			 
			 close();			 
		 });
		 
			//this.twitterLoginWatch();
		}

		//private twitterLoginWatch() {			
		//	this.twInterval = setInterval(() => {			 			
		//	 var cookieVal = this.cookieManager.getJson(Constants.cookieName);				
		//		if (cookieVal) {					
		//			clearInterval(this.twInterval);					
		//			close();
		//		}
		//		console.log("checking: " + JSON.stringify(cookieVal));
		//	}, 500);			
		//}

	}
}