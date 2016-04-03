module Reg {

	export class LoginButtonsManager {
	 
	 private $socDialog;
	 private $emailDialog;

	 private cookieSaver: AuthCookieSaver;

		public initialize(fb, google, twitter) {
			var fbBtn = new FacebookButtonInit(fb);
			fbBtn.onBeforeExecute = () => this.onBefore();
			fbBtn.onAfterExecute = () => this.onAfter();

			var googleBtn = new GoogleButtonInit(google);
			googleBtn.onBeforeExecute = () => this.onBefore();
			googleBtn.onAfterExecute = () => this.onAfter();
		 
			var twitterBtn = new TwitterButtonInit(twitter);
			twitterBtn.onBeforeExecute = () => this.onBefore();
			twitterBtn.onAfterExecute = () => this.onAfter();

			this.cookieSaver = new AuthCookieSaver();
			this.regEmailDialog();
		}

		private onBefore() {
			this.$socDialog.hide();			
		}

		private onAfter() {
		 var hint = new Common.HintDialog();
		 hint.create("You are successfully connected!");
		 $("#MenuRegister").parent().remove();

		 this.getUserMenu((r) => {
			 $("#ddMenus").append(r);
		 });
		 
		}

		private getUserMenu(callback) {
			var endpoint = "/home/component/_UserMenu";
			var request = new Common.RequestSender(endpoint, null, true);
			request.params = [];
			request.onSuccess = callback;
			
			request.sendGet();
	 }

		public createPageDialog() {
			if (!Views.ViewBase.nets) {
				this.$socDialog = $("#popup-joinSoc");
				this.$emailDialog = $("#popup-joinMail");
				this.$socDialog.show();
				this.initialize("fbBtnHome", "googleBtnHome", "twitterBtnHome");
				$("#emailJoin").click((e) => {
					this.$socDialog.hide();
					this.$emailDialog.show();
				});
				
			}
		}

	  private regEmailDialog() {
		  $("#emailReg").click((e) => {
			 e.preventDefault();
			 this.$emailDialog.hide();
			  var data = {
				 mail: $("#email").val(),
				 password: $("#password").val()
			  };
			 
			 Views.ViewBase.currentView.apiPost("MailUser", data, (r) => {
				this.cookieSaver.saveCookies(r);
				this.onAfter();
			 });
		  });		 
	  }
	}

	export class AuthCookieSaver {

		private cookiesMgr: Common.CookieManager;

		constructor() {
			this.cookiesMgr = new Common.CookieManager();
		}

		public saveCookies(res) {
			this.cookiesMgr.setString(Constants.tokenCookieName, res.Token);
			this.cookiesMgr.setString(Constants.nameCookieName, res.DisplayName);

			if (res.NetType === SocialNetworkType.Facebook) {
				Views.ViewBase.fbt = res.SocToken;			 
			}
		 
			//todo: implement
			//this.cookiesMgr.setString(Constants.socNetsCookieName, );

			//todo: remove ?
			//this.cookiesMgr.setString(, res.UserId);
		}

		public saveTwitterLogged() {
		 this.cookiesMgr.setString(Constants.twitterLoggedCookieName, "true");		 
		}

		public isTwitterLogged() : boolean {
		 var str = this.cookiesMgr.getString(Constants.twitterLoggedCookieName);
			if (str) {
				return true;
		 }
			return false;
		}

	}

	export class TwitterButtonInit {

		private cookiesSaver: AuthCookieSaver;

		public onBeforeExecute: Function;
		public onAfterExecute: Function;

		constructor(btn) {
			this.cookiesSaver = new AuthCookieSaver();
			var $btn = $(`#${btn}`);
			$btn.click((e) => {
				e.preventDefault();
				if (this.onBeforeExecute) {
					this.onBeforeExecute();
				}
				this.twitterAuthorize();
			});
		}

		public twitterAuthorize() {
			this.twitterLoginWatch(() => {
			 if (this.onAfterExecute) {
				this.onAfterExecute();
			 }
			});
			var url = '/TwitterUser/Authorize';
			var wnd = window.open(url, "Twitter authentication", "height=500px,width=400px");
		}

		private twInterval = null;

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

	export class GoogleButtonInit {

		public onBeforeExecute: Function;
		public onAfterExecute: Function;

		private cookiesSaver: AuthCookieSaver;

		constructor(btnId) {
			this.cookiesSaver = new AuthCookieSaver();
			this.initialize(btnId);
		}

		private initialize(btnId) {
			var btnGoogle = new GoogleButton();
			btnGoogle.onBeforeClick = () => {
				if (this.onBeforeExecute) {
					this.onBeforeExecute();
				}
			};
			btnGoogle.successfulCallback = (googleUser) => {
				var data = googleUser;
				Views.ViewBase.currentView.apiPost("GoogleUser", data, (r) => {
					this.cookiesSaver.saveCookies(r);
					if (this.onAfterExecute) {
						this.onAfterExecute();
					}
					//unload sdk ?
				});
			};

			btnGoogle.initialize(btnId);
		}
	}

	export class FacebookButtonInit {

	 public onBeforeExecute: Function;
	 public onAfterExecute: Function;

	 private cookiesSaver: AuthCookieSaver;

	 constructor(btnId) {
			this.cookiesSaver = new AuthCookieSaver();
			this.registerFacebookButton(btnId);
		}

		private registerFacebookButton(btnId) {

			var $btn = $(`#${btnId}`);

			this.initializeFacebookSdk(() => {
				$btn.click((e) => {
					e.preventDefault();
					if (this.onBeforeExecute) {
						this.onBeforeExecute();
					}
					var auth = new FacebookAuth();
					auth.onSuccessful = (user) => {
						var data = user;
						Views.ViewBase.currentView.apiPost("FacebookUser", data, (r) => {
							this.cookiesSaver.saveCookies(r);
							if (this.onAfterExecute) {
								this.onAfterExecute();
							}
							//unload sdk ?
						});
					};
					auth.login();
				});
			});
		}

		private initializeFacebookSdk(callback) {
			var fbInit = new FacebookInit();

			fbInit.onFacebookInitialized = () => {
				console.log("fb initialized");
				callback();				
			}

			fbInit.initialize();

		}
	}
}