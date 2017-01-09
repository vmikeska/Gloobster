module Views {

	export class TwitterAuthView  {

	 private cookiesSaver: Reg.AuthCookieSaver;

		constructor() {		 
		 this.cookiesSaver = new Reg.AuthCookieSaver();
		}
	 
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

		public apiPost(endpointName: string, data: any, callback: Function) {

		 var endpoint = '/api/' + endpointName;

		 var request = new Common.RequestSender(endpoint, data, true);
		 request.serializeData();
		 request.onSuccess = callback;
		 request.onError = response => { console.log(JSON.stringify(response)) };
		 request.sendPost();
		}
	}
}