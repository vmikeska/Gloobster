module Views {
	export class HomePageView extends ViewBase {

		constructor() {
			super();

			$("#twitterLoginBtnHome").click((e) => {
				e.preventDefault();
				this.twitterAuthorize();
			});

			$("#facebookLoginBtnHome").click((e) => {
				e.preventDefault();
				this.loginManager.facebookUserCreator.registerOrLogin();
			});

		}

		get pageType(): PageType { return PageType.HomePage; }

		public registerNormal(mail: string, password: string) {

			var data = { "mail": mail, "password": password };
			super.apiPost("User", data, response => {
				alert("user registred");
			});
		}
	 
		public twitterAuthorize() {
			this.twitterLoginWatch();
			var url = '/TwitterUser/MailStep';
			var wnd = window.open(url, "Twitter authentication", "height=500px,width=400px");
		}

	 private twInterval = null;

		private twitterLoginWatch() {
			this.twInterval = setInterval(() => {
				var cookieVal = this.cookieManager.getJson(Constants.cookieName);
				if (cookieVal) {
					clearInterval(this.twInterval);
					window.location.href = Constants.firstRedirectUrl;
				}
				console.log("checking: " + JSON.stringify(cookieVal));
			}, 500);
		}

	}
}