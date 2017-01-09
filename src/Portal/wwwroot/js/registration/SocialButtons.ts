module Reg {

	export class LoginButtonsManager {
			
	 private $socDialog;
	 private $emailDialog;

	 public onAfterCustom: Function;

	 private cookieSaver: AuthCookieSaver;

	 public initialize(fb, google, twitter) {
		 
			var fbBtn = new FacebookButtonInit(fb);
			fbBtn.onBeforeExecute = () => this.onBefore(SocialNetworkType.Facebook);
			fbBtn.onAfterExecute = () => this.onAfter(SocialNetworkType.Facebook);

			var googleBtn = new GoogleButtonInit(google);
			googleBtn.onBeforeExecute = () => this.onBefore(SocialNetworkType.Google);
			googleBtn.onAfterExecute = () => this.onAfter(SocialNetworkType.Google);
		 
			var twitterBtn = new TwitterButtonInit(twitter);
			twitterBtn.onBeforeExecute = () => this.onBefore(SocialNetworkType.Twitter);
			twitterBtn.onAfterExecute = () => this.onAfter(SocialNetworkType.Twitter);

			this.cookieSaver = new AuthCookieSaver();
			this.regEmailDialog();
		}

		private onBefore(net) {
			this.$socDialog.hide();			
		}

		private onAfter(net: SocialNetworkType) {

				Views.ViewBase.fullRegistration = true;

				if (this.onAfterCustom) {
						this.onAfterCustom(net);
				}

				$(".login-all").remove();

				if (Views.ViewBase.currentView.pageType === PageType.HomePage) {
					window.location.href = window["dashboardLink"];
				} else {
						var v = Views.ViewBase.currentView;

						var hint = new Common.HintDialog();
						hint.create(v.t("SuccessConnected", "jsLayout"));
						this.showUserMenu();
				}				
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

				this.$socDialog = $("#socDlg");
				this.$emailDialog = $("#emailDlg");

				this.$socDialog.show();
				this.initialize("fbBtnReg", "googleBtnReg", "twitterBtnReg");

				$(".login-all")
					.find(".close")
					.click((e) => {
						e.preventDefault();

						var $act = $(e.target).closest(".login-all");

						$act.hide();

						if ($act.attr("id") === "emailDlg") {
							this.$socDialog.show();
						}
					});

				$("#emailBtn")
					.click((e) => {
						e.preventDefault();
						this.$socDialog.hide();
						this.$emailDialog.show();
					});

				$("#emailCancel")
					.click((e) => {
						this.$emailDialog.hide();
						this.$socDialog.show();
					});

			} else {
				this.showUserMenu();
			}
		}

			private showUserMenu() {
				$(".after-login").removeClass("hidden");
			}

		private regEmailDialog() {

				var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				var $email = $("#email");
			var $pass = $("#password");

			$email.on("input", (e) => {
				var val = $email.val();
				var valid = emailRegex.test(val);				
				$email.data("valid", valid);					
			});


			$("#emailReg").click((e) => {
				e.preventDefault();
				this.sendMailReq();
			});

			$pass.keypress(e => {
				var keycode = (e.keyCode ? e.keyCode : e.which);
				if (keycode === 13) {
					this.sendMailReq();
				}
			});

		}

		private sendMailReq() {
				var $email = $("#email");
				var $pass = $("#password");

				var passLength = $pass.val().length;

			var id = new Common.InfoDialog();
				
			var v = Views.ViewBase.currentView;

			var mail = $email.data("valid");
			if (mail === "false" || mail === false) {					
					id.create(v.t("InvalidEmailTitle", "jsLayout"), v.t("InvalidEmailBody", "jsLayout"));
				return;
			}
				
			if (passLength < 4 || passLength > 30) {
					id.create(v.t("InvalidPasswordTitle", "jsLayout"), v.t("InvalidPasswordBody", "jsLayout"));
					return;
			}

			this.$emailDialog.hide();

			var data = {
				mail: $email.val(),
				password: $("#password").val()
			};

			Views.ViewBase.currentView.apiPost("MailUser", data, (r) => {

					if (!r.Successful) {
							id.create(v.t("IncorrectPasswordTitle", "jsLayout"), v.t("IncorrectPasswordBody", "jsLayout"));
							this.$emailDialog.show();
						return;
					}

					this.cookieSaver.saveCookies(r);
					this.onAfter(SocialNetworkType.Base);
				});
		}

	}

	export class LoginResponseValidator {
	 
	 public validate(res): boolean {
		var v = Views.ViewBase.currentView;
			var id = new Common.InfoDialog();
			if (!res) {
			 id.create(v.t("UnsuccessLogin", "jsLayout"), v.t("UnsuccessLoginBody", "jsLayout"));
				return false;
			}
			if (res.AccountAlreadyInUse) {
			 id.create(v.t("CannotPair", "jsLayout"), v.t("CannotPairBody", "jsLayout"));
				return false;
			}

			return true;
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
			this.cookiesMgr.setString(Constants.fullRegCookieName, res.FullRegistration);
		 
			if (res.NetType === SocialNetworkType.Facebook) {
				Views.ViewBase.fbt = res.SocToken;			 
			}		 
		}

	  public removeCookies() {
		 this.cookiesMgr.removeCookie(Constants.tokenCookieName);
		 this.cookiesMgr.removeCookie(Constants.nameCookieName);
		 this.cookiesMgr.removeCookie(Constants.fullRegCookieName);
		 this.cookiesMgr.removeCookie(Constants.twitterLoggedCookieName);
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
					var lrv = new LoginResponseValidator();
					var resValid = lrv.validate(r);
					if (!resValid) {
						return;
					}
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
							var lrv = new LoginResponseValidator();
							var resValid = lrv.validate(r);
							if (!resValid) {
								return;
							}

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
			fbInit.initialize(callback);

		}
	}
}