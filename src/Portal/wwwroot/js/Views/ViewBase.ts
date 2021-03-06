
module Views {

		export class ViewBase {

				public static currentView;
				public static nets: string;
				public static fbt: string;

				public static currentUserId: string;
				public static fullRegistration: boolean;

				public static v<T>() {
						return <T>this.currentView;
				}

				public loginButtonsManager: Reg.LoginButtonsManager;

				public cookieManager: Common.CookieManager;

				public onLogin: Function;

				get pageType(): PageType { return null; }

				public get fullReg(): Boolean {
						return this.cookieManager.getString(Constants.fullRegCookieName) === "true";
				}

				constructor() {
						ViewBase.currentView = this;
						this.cookieManager = new Common.CookieManager();
						this.regUserMenu();

						this.loginButtonsManager = new Reg.LoginButtonsManager();
						this.loginButtonsManager.createPageDialog();

						if ($(document).tooltip) {
								$(document).tooltip();
						}

						this.initDemoFnc();

						this.initTitleFnc();

						this.infoCookie();
				}

				public static scrollTo($s) {
						$("html, body").animate({ scrollTop: $s.offset().top }, "slow");
				}

				public static fullReqCheck(callback: Function, unCallback: Function = null) {

						if (ViewBase.fullRegistration) {
								callback();
								return;
						}

						var id = new Common.InfoDialog();

						var v = ViewBase.currentView;
						id.create(v.t("FullReqRequiredTitle", "jsLayout"), v.t("FullReqRequiredBody", "jsLayout"));

						if (unCallback) {
								unCallback();
						}
				}

				public static setUrl(url, title, state = null) {
						window.history.replaceState(state, title, url);
				}

				private infoCookie() {
						$("#confirmCookies").click((e) => {
								e.preventDefault();

								this.cookieManager.setString("CookiesConfirmed", "a");

								$(".cookies-info").remove();
						});
				}

				private initTitleFnc() {
						var $ibAll = $(".info-block-bck");
						var $btn = $ibAll.find(".showHide");

						$btn.click((e) => {
								e.preventDefault();

								var id = $ibAll.attr("id");
								var $ib = $ibAll.find(".info-block");

								var visible = $ib.css("display") === "block";
								$btn.attr("title", (visible ? $btn.data("ts") : $btn.data("th")));

								if (visible) {
										$btn.addClass("icon-info");
										$btn.removeClass("icon-close-cross");
								} else {
										$btn.removeClass("icon-info");
										$btn.addClass("icon-close-cross");
								}

								if (!visible) {
										$ibAll.removeClass("collapsed");
								}

								var data = this.cookieManager.getJson("InfoBlocks");
								if (data) {
										var thisInfo = _.find(data.infos, (info) => {
												return info.id === id;
										});

										if (thisInfo) {
												thisInfo.visible = !visible;
										} else {
												data.infos.push({ id: id, visible: false });
										}

								} else {
										data = { infos: [{ id: id, visible: false }] }
								}
								this.cookieManager.setJson("InfoBlocks", data);

								$ib.slideToggle(() => {
										if (visible) {
												$ibAll.addClass("collapsed");
										}
								});
						});
				}

				private initDemoFnc() {

						$("#switchVersion").click((e) => {
								var ds = this.cookieManager.getString("Demo");

								var newVal = ds === "on" ? "off" : "on";

								this.cookieManager.setString("Demo", newVal);
								location.reload();
						});

						var ds = this.cookieManager.getString("Demo");

						var urlParam = this.getUrlParam("demo");
						if (urlParam && !ds) {
								this.cookieManager.setString("Demo", "on");
								location.reload();
						}

						if (ds) {
								$(".ver-switch").show();

								var href = $("#switchVersion");

								if (ds === "on") {
										href.addClass("icon-toggle-on");
								} else {
										href.addClass("icon-toggle-off");
								}
						}
				}

				public getUrlParam(name) {
						var url = window.location.href;
						name = name.replace(/[\[\]]/g, "\\$&");
						var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
						var results = regex.exec(url);
						if (!results) return null;
						if (!results[2]) return "";
						return decodeURIComponent(results[2].replace(/\+/g, " "));
				}

				private regUserMenu() {
						$("#logoutUser").click((e) => {
								this.logout();
						});

						$("#admin-btn").click((e) => {
								$(".admin-menu-all").toggle();
						});
				}

				public hasSocNetwork(net: SocialNetworkType) {
						var prms = ViewBase.nets.split(",");

						if (_.contains(prms, net.toString())) {
								return true;
						}

						return false;
				}

				public t(key: string, module: string) {
						var modules = window["modules"];
						if (!modules) {
								return "NoModules";
						}

						var mod = _.find(modules, (m) => {
								return m.Name === module;
						});

						if (!mod) {
								return "NotFoundModule";
						}

						var text = _.find(mod.Texts, (t) => {
								return t.Name === key;
						});

						if (!text) {
								return "KeyNotFound";
						}

						return text.Text;
				}

				public logout() {
						var auth = new Reg.AuthCookieSaver();
						auth.removeCookies();
						window.location.href = "/";
				}

				public apiGet(endpointName: string, params: string[][], callback: Function) {

						var endpoint = `/api/${endpointName}`;
						console.log(`getting: ${endpoint}`);

						var request = new Common.RequestSender(endpoint, null, true);
						request.params = params;
						request.onSuccess = callback;
						request.onError = response => {
								Common.ErrorDialog.show(endpointName);
						};
						request.sendGet();
				}

				public apiPost(endpointName: string, data: any, callback: Function) {

						var endpoint = `/api/${endpointName}`;
						console.log("posting: " + endpoint);

						var request = new Common.RequestSender(endpoint, data, true);
						request.serializeData();
						request.onSuccess = callback;
						request.onError = response => {
								Common.ErrorDialog.show(endpointName);
						};
						request.sendPost();
				}

				public apiPut(endpointName: string, data: any, callback: Function) {

						var endpoint = `/api/${endpointName}`;
						console.log("putting: " + endpoint);

						var request = new Common.RequestSender(endpoint, data, true);
						request.serializeData();
						request.onSuccess = callback;
						request.onError = response => {
								Common.ErrorDialog.show(endpointName);
						};
						request.sendPut();
				}

				public apiDelete(endpointName: string, params: string[][], callback: Function) {

						var endpoint = `/api/${endpointName}`;
						console.log("deleting: " + endpoint);

						var request = new Common.RequestSender(endpoint, null, true);
						request.params = params;
						request.onSuccess = callback;
						request.onError = response => {
								Common.ErrorDialog.show(endpointName);
						};
						request.sendDelete();
				}

				public registerTemplate(name: string) {
						var $t = $(`#${name}`);

						if ($t.length === 0) {
								console.log(`Template '${name} not found`);
						}

						var source = $t.html();

						return Handlebars.compile(source);
				}

				public makeRandomString(cnt: number) {
						var text = "";
						var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

						for (var i = 0; i < 10; i++)
								text += possible.charAt(Math.floor(Math.random() * possible.length));

						return text;
				}

				public static getMobileOS(): OS {
						var userAgent = navigator.userAgent || navigator.vendor || window["opera"];

						// Windows Phone must come first because its UA also contains "Android"
						if (/windows phone/i.test(userAgent)) {
								return OS.WP;
						}

						if (/android/i.test(userAgent)) {
								return OS.A;
						}

						// iOS detection from: http://stackoverflow.com/a/9039885/177710
						if (/iPad|iPhone|iPod/.test(userAgent) && !window["MSStream"]) {
								return OS.IOS;
						}

						return OS.Other;
				}

		}


}
