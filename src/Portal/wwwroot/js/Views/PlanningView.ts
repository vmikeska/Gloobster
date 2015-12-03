module Views {
	export class PlanningView extends ViewBase {

		private maps: Maps.MapsCreatorMapBox2D;

		public mapsOperations: Planning.PlanningMap;

		private anytimeTabTemplate: any;
		private weekendTabTemplate: any;
		private customTabTemplate: any;

		constructor() {
			super();

			this.initialize();
			this.registerTabEvents();
		}

		public initialize() {
			this.maps = new Maps.MapsCreatorMapBox2D();
			this.maps.setRootElement("map");
			this.maps.show((map) => {
				this.mapsOperations = new Planning.PlanningMap(map);
				this.mapsOperations.loadCategory(Planning.PlanningType.Anytime);
			});

			var locationDialog = new LocationSettingsDialog();
		}

		private registerTabEvents() {
			this.anytimeTabTemplate = ViewBase.currentView.registerTemplate("anytime-template");
			this.weekendTabTemplate = ViewBase.currentView.registerTemplate("weekend-template");
			this.customTabTemplate = ViewBase.currentView.registerTemplate("custom-template");

			var $tabsRoot = $(".tabs");
			var $tabs = $tabsRoot.find(".tab");
			$tabs.click((e) => { this.switchTab($(e.delegateTarget), $tabs); });
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

			this.onTabSwitched(tabType);
		}

		private onTabSwitched(tabType: Planning.PlanningType) {
			this.mapsOperations.loadCategory(tabType);
		}

	}
}