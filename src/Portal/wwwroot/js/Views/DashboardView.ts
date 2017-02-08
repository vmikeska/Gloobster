module Views {
	export class DashboardView extends ViewBase {

			public ccs;
			public canQueryResults: boolean;

		private tabs: Common.Tabs;

		private $tbFriends;
		private $tbPortal;
		private $tbWebNavi;
		private $tabFriends;
		private $tabPortal;
		private $tabWebNavi;
		private $titles;

		private $calendar;

		constructor() {
			super();				
		}

		private init() {
				this.initTabs();

				this.$tbFriends = $(".tb-friends");
				this.$tbPortal = $(".tb-portal");
				this.$tbWebNavi = $(".tb-web");

				this.$tabFriends = $("#tabFriends").parent();
				this.$tabPortal = $("#tabPortal").parent();
				this.$tabWebNavi = $("#tabWebNavi").parent();

				this.$titles = $(".topic-block .title");
				
				this.initResize();

				this.initMap();

				this.initCalendar();

				this.initDeals();

			this.regFriendsRecomm();
		}

		private anytimeRes;
		private weekendRes;

		private anytimeFinished = false;
		private weekendFinished = false;

			private regFriendsRecomm() {
					var $form = $(".joined-friends");

					$form.find(".form-close").click((e) => {
						e.preventDefault();
					$form.hide();
				});

				$form.find(".request").click((e) => {
					e.preventDefault();

						var $t = $(e.target);

						var $item = $t.closest(".item-all");
						var uid = $item.data("uid");

						var data = { "friendId": uid, "action": FriendActionType.Request };
						this.apiPost("Friends", data, response => {
								$item.remove();

							var anyItems = $form.find(".item-all").length > 0;
							if (!anyItems) {
								$form.hide();
							}
						});

				});
			}

			private initDeals() {

					AirLoc.registerLocationCombo($("#currentCity"), (place) => {
							window.location.href = "/deals";
					});

				if (this.canQueryResults) {

					this.startResMgr(PlanningType.Anytime,
						(res) => {
								this.anytimeRes = res;	
								this.displayResults();						
						},
						() => {
								this.anytimeFinished = true;
								this.canHidePreload();								
						});

					this.startResMgr(PlanningType.Weekend,
						(res) => {
								this.weekendRes = res;	
								this.displayResults();						
						},
						() => {
								this.weekendFinished = true;
							this.canHidePreload();								
						});

				}


			}

			private canHidePreload() {
					if (this.anytimeFinished && this.weekendFinished) {
							$(".your-deals-result-all .preload-all").hide();
					}
			}

			private displayResults() {
					
					var res = { Excellent: 0, Good: 0, Standard: 0 };

					if (this.anytimeRes) {
							res.Excellent += this.anytimeRes.Excellent;
							res.Good += this.anytimeRes.Good;
							res.Standard += this.anytimeRes.Standard;
					}

					if (this.weekendRes) {
							res.Excellent += this.weekendRes.Excellent;
							res.Good += this.weekendRes.Good;
							res.Standard += this.weekendRes.Standard;
					}

					$("#res5").html(res.Excellent);
					$("#res3").html(res.Good);
					$("#res1").html(res.Standard);

				
			}

			private startResMgr(pt: PlanningType, onChange: Function, onQueueFinished: Function) {					
					var rm = new Planning.ResultsManager();

					rm.onDrawQueue = () => {						
							if (!any(rm.queue)) {
								onQueueFinished();
							} 
					}

					rm.onResultsChanged = (queries) => {
							var de = new Planning.DelasEval(rm.timeType, queries);
							de.countDeals();
						onChange(de.res);
					};

					rm.initalCall(pt);
			}

			private initMap() {
				this.ccs.forEach((cc) => {
						var cg = $(`.your-map-all [cc="${cc.toLowerCase()}"]`);
						cg.css("fill", "#005476");
				});
			}

		private initCalendar() {

			this.createCalendar();

			var fromTo = Dashboard.CalendarUtils.getCalRange(this.$calendar);

			var from = TravelB.DateUtils.momentDateToTrans(fromTo.from);
			var to = TravelB.DateUtils.momentDateToTrans(fromTo.to);

			var prms = [["from", from], ["to", to]];

			this.apiGet("FriendsEvents", prms, (events) => {

					var evnts = _.map(events, (event) => { return Dashboard.CalendarUtils.convertEvent(event) });

					evnts.forEach((evnt) => {
						this.$calendar.fullCalendar("renderEvent", evnt);
					});

				});
		}
			
		private createCalendar() {
				
			 this.$calendar = $("#calendar").fullCalendar({
					header: false,
					footer: false,					
					navLinks: false, 
					editable: false,
					eventLimit: true,
					fixedWeekCount: false,
					height: "auto",
					eventClick(evnt) {
							window.open(`/trip/${evnt.tripId}`);
					}
				});
		}
			
		private initTabs() {

			this.tabs = new Common.Tabs($("#menuCont"), "main");
			this.tabs.initCall = false;
			this.tabs.onBeforeSwitch = () => {

			}
				
			var tab1 = { id: "tabFriends", text: this.t("TabFriends", "jsDashboard"), cls: "hidden" };
			this.tabs.addTabConf(tab1, () => {
					this.setConts(this.$tbFriends);
			});

			var tab2 = { id: "tabPortal", text: this.t("TabPortal", "jsDashboard"), cls: "hidden" };
			this.tabs.addTabConf(tab2, () => {
					this.setConts(this.$tbPortal);
			});

			var tab3 = { id: "tabWebNavi", text: this.t("TabWeb", "jsDashboard"), cls: "hidden" };
			this.tabs.addTabConf(tab3, () => {
					this.setConts(this.$tbWebNavi);
			});

			this.tabs.create();
				
		}


		private initResize() {
			$(window).resize(() => {
					this.resize();
				});

			this.resize();
		}

		private resize() {
					var width = $(window).width();
					this.setPage(width);
			}

		private blocksCnt = 0;
			private lastWidth = 0;

			private setPage(width) {

					if (this.lastWidth === width) {
						return;
					}

				this.lastWidth = width;
					
					var w1 = 1100;
					var w2 = 750;

					this.$tbFriends.addClass("hidden");
					this.$tbPortal.addClass("hidden");
					this.$tbWebNavi.addClass("hidden");

					this.$tabFriends.addClass("hidden");
					this.$tabPortal.addClass("hidden");
					this.$tabWebNavi.addClass("hidden");

					this.$titles.addClass("hidden");

					if (width > w1) {
							this.$tbFriends.removeClass("hidden");
							this.$tbPortal.removeClass("hidden");
							this.$tbWebNavi.removeClass("hidden");
							
							this.blocksCnt = 3;							

							this.$titles.removeClass("hidden");
					} else if (width > w2) {
							this.$tbPortal.removeClass("hidden");	
							this.$tbWebNavi.removeClass("hidden");
							
							this.$tabFriends.removeClass("hidden");
							this.$tabPortal.removeClass("hidden");							

							this.blocksCnt = 2;

							this.tabs.activateTab(this.$tabPortal.find(".btn"));

							this.$titles.removeClass("hidden");
					} else {
							this.$tbWebNavi.removeClass("hidden");

							this.$tabFriends.removeClass("hidden");
							this.$tabPortal.removeClass("hidden");
							this.$tabWebNavi.removeClass("hidden");

							this.blocksCnt = 1;

							this.tabs.activateTab(this.$tabWebNavi.find(".btn"));							
					}				
			}
			
			private setConts($block) {
					
					this.$tbFriends.addClass("hidden");
					this.$tbPortal.addClass("hidden");							
					
					if (this.blocksCnt === 1) {					
							this.$tbWebNavi.addClass("hidden");							
					}					

					$block.removeClass("hidden");
			}

		}
		
}