module Views {

	export class TwitterAuthView
	 extends ViewBase {

		constructor() {
			super();
		}

		get pageType(): Views.PageType { return PageType.TwitterAuth; }

		private twInterval = null;

		private handleRoughResponse(resp) {
			this.loginManager.twitterUserCreator.handleRoughResponse(resp);
			this.twitterLoginWatch();
		}

		private twitterLoginWatch() {			
			this.twInterval = setInterval(() => {			 			
			 var cookieVal = this.cookieManager.getJson(Constants.cookieName);				
				if (cookieVal) {					
					clearInterval(this.twInterval);					
					close();
				}
				console.log("checking: " + JSON.stringify(cookieVal));
			}, 500);			
		}

	}
}