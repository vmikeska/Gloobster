module Views {
	export class HomePageView extends ViewBase {

		constructor() {
		 super();

		 var loginButtons = new Reg.LoginButtonsManager();		 
		 loginButtons.initialize("fbBtnHome", "googleBtnHome", "twitterBtnHome");
		}

		get pageType(): PageType { return PageType.HomePage; }

		public registerNormal(mail: string, password: string) {

			var data = { "mail": mail, "password": password };
			super.apiPost("User", data, response => {
				alert("user registred");
			});
		}
	 
	}
}