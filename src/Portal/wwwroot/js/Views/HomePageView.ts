module Views {
	export class HomePageView extends ViewBase {
	 
	 constructor() {		
		 super();
		
		 this.initialize("fbBtnHome", "googleBtnHome", "twitterBtnHome");
	 }

		public initialize(fb, google, twitter) {
		 var fbBtn = new Reg.FacebookButtonInit(fb);
		 fbBtn.onBeforeExecute = () => this.onBefore();
		 fbBtn.onAfterExecute = () => this.onAfter();

		 var googleBtn = new Reg.GoogleButtonInit(google);
		 googleBtn.onBeforeExecute = () => this.onBefore();
		 googleBtn.onAfterExecute = () => this.onAfter();

		 var twitterBtn = new Reg.TwitterButtonInit(twitter);
		 twitterBtn.onBeforeExecute = () => this.onBefore();
		 twitterBtn.onAfterExecute = () => this.onAfter();		 
	 }

		private onBefore() {
		 $(".logins").hide();
			$("#preloader").show();
		}

		private onAfter() {
		 window.location.href = Constants.firstRedirectUrl;
		}

		public get pageType(): PageType { return PageType.HomePage; }
	 
	}
}