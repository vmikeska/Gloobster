
class PlanningView extends Views.ViewBase {

 private maps: MapsCreatorMapBox2D;
  
 public mapsOperations: PlanningMap;
 
 private anytimeTabTemplate: any;
 private weekendTabTemplate: any;
 private customTabTemplate: any;

 constructor() {
	 super();
	
	 this.initialize();
	 this.registerTabEvents();
 }

	public initialize() {
		this.maps = new MapsCreatorMapBox2D();
		this.maps.setRootElement("map");
		this.maps.show((map) => {
		 this.mapsOperations = new PlanningMap(map);
		 this.mapsOperations.loadCategory(PlanningType.Anytime);
		});

		var locationDialog = new LocationSettingsDialog();
	}

  private registerTabEvents() {
	 this.anytimeTabTemplate = Views.ViewBase.currentView.registerTemplate("anytime-template");
	 this.weekendTabTemplate = Views.ViewBase.currentView.registerTemplate("weekend-template");
	 this.customTabTemplate = Views.ViewBase.currentView.registerTemplate("custom-template");

	  var $tabsRoot = $(".tabs");
	  var $tabs = $tabsRoot.find(".tab");
		$tabs.click((e) => { this.switchTab($(e.delegateTarget), $tabs); });
  }
 
	private switchTab($target, $tabs) {
		$tabs.removeClass("active");
		$target.addClass("active");


		var tabType = parseInt($target.data("type"));
		var tabHtml = "";
		if (tabType === PlanningType.Anytime) {
			tabHtml = this.anytimeTabTemplate();
		}
		if (tabType === PlanningType.Weekend) {
		 tabHtml = this.weekendTabTemplate();		 
		}
		if (tabType === PlanningType.Custom) {
			tabHtml = this.customTabTemplate();
		}

		var $tabContent = $("#tabContent");
		$tabContent.html(tabHtml);

		this.onTabSwitched(tabType);
	}

	private onTabSwitched(tabType: PlanningType) {
		this.mapsOperations.loadCategory(tabType);
	}

}