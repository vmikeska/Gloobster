module Views {
	export class DashboardView extends ViewBase {

		public ccs;

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
			
			var tab1 = { id: "tabFriends", text: "Friend's feed", cls: "hidden" };
			this.tabs.addTabConf(tab1, () => {
					this.setConts(this.$tbFriends);
			});

			var tab2 = { id: "tabPortal", text: "Portal feed", cls: "hidden" };
			this.tabs.addTabConf(tab2, () => {
					this.setConts(this.$tbPortal);
			});

			var tab3 = { id: "tabWebNavi", text: "Web navigation", cls: "hidden" };
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