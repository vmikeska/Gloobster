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
			 this.cookiesSaver.saveTwitterLogged();
			 this.cookiesSaver.saveCookies(r);		
			 this.twitterLoginWatch(() => {
				close();
			 });	 			 	 
		 });
		 			
		}

		private twitterLoginWatch(callback) {
			this.twInterval = setInterval(() => {
				var isLogged = this.cookiesSaver.isTwitterLogged();
				if (isLogged) {
				 clearInterval(this.twInterval);
					callback();					
				}				
			}, 500);
		}
	}
}