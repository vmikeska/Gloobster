module TravelB {

		export class CheckinMenu {

				private view: Views.TravelBView;

				private $menuCont = $(".checkin-row");
				private $win = $(".checkin-win");
				private $wcont = this.$win.find(".cont");

				private cityCheckins: CityCheckinsMgmt;

				constructor(view: Views.TravelBView) {
						this.view = view;

						this.cityCheckins = new CityCheckinsMgmt(view);

						this.init();
				}

				private init() {

						var $as = this.$menuCont.find("a");

						$as.click((e) => {
								e.preventDefault();

								$as.removeClass("active");

								var $t = $(e.delegateTarget);
								$t.addClass("active");
								var bt = $t.data("t");

								this.activateTab(bt);

						});

					this.$win.find(".close").click((e) => {
						e.preventDefault();

						this.hideWin();
					});
				}

				public hideWin() {
						var $as = this.$menuCont.find("a");

						this.$win.slideUp(() => {
								$as.removeClass("active");
								this.$wcont.empty();
						});
				}

				private lastStatusVisibility = false;

				public setCheckinByTab(type) {
						this.deactivateTopMenu();
						
						if (type === this.view.nowTabConst) {
								$(".checkin-row").show();

							if (this.lastStatusVisibility) {
									$(".status-row").show();
									$(".checkin-row").hide();
							} else {
									$(".status-row").hide();
									$(".checkin-row").show();
							}
						}

						if (type === this.view.cityTabConst) {
								this.lastStatusVisibility = $(".status-row").is(":visible");

								$(".checkin-row").show();
								$(".status-row").hide();
						}
				}

				public activateTab(bt, id = null) {
						if (bt === "check") {
								if (this.view.tabs.activeTabId === this.view.nowTabConst) {
										this.view.checkinWin.showNowCheckin(() => {
												this.fillAndShow(this.view.checkinWin.$html);
										});
								} else {
										this.view.checkinWin.showCityCheckin(id, () => {
												this.fillAndShow(this.view.checkinWin.$html);
										});
								}
						}
						if (bt === "manage") {
								this.cityCheckins.genCheckins(() => {
										this.$win.slideDown();
								});
						}
				}

				private fillAndShow($html) {
						this.$wcont.html(this.view.checkinWin.$html);

						this.$win.slideDown();
				}

				private deactivateTopMenu() {
						var $as = this.$menuCont.find("a");
						$as.removeClass("active");

						this.$win.hide();
				}

		}

}