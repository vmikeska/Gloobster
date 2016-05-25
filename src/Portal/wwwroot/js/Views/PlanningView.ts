module Views {
	export class PlanningView extends ViewBase {

		public planningMap: Planning.PlanningMap;

		private maps: Maps.MapsCreatorMapBox2D;
		private tabsTime: TabsTime;
		private tabsWeekendViews: TabsWeekendViews;

		//private weekendDisplay: Planning.WeekendDisplay;

		constructor() {
			super();

			this.initialize();

			this.tabsTime = new TabsTime();
			this.tabsTime.onTabSwitched = ((tabType) => {
				this.planningMap.loadCategory(tabType);
			});

			//this.tabsWeekendViews.onTabSwitched = ((tabType) => {
			//		if (tabType === 1) {

			//		}
			//});

			this.tabsWeekendViews = new TabsWeekendViews();
		}

		public initialize() {
			this.maps = new Maps.MapsCreatorMapBox2D();
			this.maps.setRootElement("map");
			this.maps.show((map) => {
				this.planningMap = new Planning.PlanningMap(map);
				this.planningMap.loadCategory(Planning.PlanningType.Anytime);
			});

			var locationDialog = new LocationSettingsDialog();
		}


	}

	export class TabsTime {

		public onTabSwitched: Function;

		constructor() {
			this.registerTabEvents();
		}

		private anytimeTabTemplate: any;
		private weekendTabTemplate: any;
		private customTabTemplate: any;

		private registerTabEvents() {
			this.anytimeTabTemplate = ViewBase.currentView.registerTemplate("anytime-template");
			this.weekendTabTemplate = ViewBase.currentView.registerTemplate("weekend-template");
			this.customTabTemplate = ViewBase.currentView.registerTemplate("custom-template");

			var $tabsRoot = $("#TimeTab");
			var $tabs = $tabsRoot.find(".tab");
			$tabs.click((e) => {
				e.preventDefault();
				this.switchTab($(e.delegateTarget), $tabs);
			});
		}

		private switchTab($target, $tabs) {
			$tabs.removeClass("active");
			$target.addClass("active");

			var tabType = parseInt($target.data("type"));
			var tabHtml = "";
			if (tabType === Planning.PlanningType.Anytime) {
				tabHtml = this.anytimeTabTemplate();
			}
			if (tabType === Planning.PlanningType.Weekend) {
				tabHtml = this.weekendTabTemplate();
			}
			if (tabType === Planning.PlanningType.Custom) {
				tabHtml = this.customTabTemplate();
			}

			var $tabContent = $("#tabContent");
			$tabContent.html(tabHtml);

			if (this.onTabSwitched) {
				this.onTabSwitched(tabType);
			}
		}
	}

	export class TabsWeekendViews {

		public onTabSwitched: Function;

		constructor() {
			this.registerTabEvents();
		}

		private registerTabEvents() {

			var $tabsRoot = $("#TabsWeekendTime");
			var $tabs = $tabsRoot.find(".tab");
			$tabs.click((e) => {
				e.preventDefault();
				this.switchTab($(e.delegateTarget), $tabs);
			});
		}

		private switchTab($target, $tabs) {
			$tabs.removeClass("active");
			$target.addClass("active");

			var tabType = parseInt($target.data("type"));
			var tabHtml = "";

			var $tabContent = $("#tabContent");
			$tabContent.html(tabHtml);

			if (this.onTabSwitched) {
				this.onTabSwitched(tabType);
			}
		}
	}


}