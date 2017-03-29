module Views {

		export class NewAdminView extends ViewBase {

				public isMasterAdmin;
				public isSuperAdmin;
				public isAdminOfSomething;

				private currentPage: AdminPageBase;

				constructor() {
						super();
				}

				private init() {
						this.initTabs();
				}


				private initTabs() {
						var tabs = new Common.Tabs($("#mainTabs"), "main");

						if (this.isMasterAdmin || this.isSuperAdmin || this.isAdminOfSomething) {
								tabs.addTab("wikiTab", "WIKI", () => {
										this.currentPage = new WikiAdminPage(this);
								});
						}

						if (this.isMasterAdmin) {
								//tabs.addTab("travelbTab", "Travel buddy");
								//tabs.addTab("dashboardTab", "Dashboard");
								tabs.addTab("quizTab", "Quiz", () => {
									this.currentPage = new QuizAdminPage(this);
								});
						}

						tabs.create();
				}
		}


		export class AdminPageBase {
				public $cont;

				public v: NewAdminView;

				constructor(v: NewAdminView, layoutTmpName: string = null) {
						this.v = v;
						this.$cont = $(".page-cont");

						if (layoutTmpName) {
								var layoutTmp = ViewBase.currentView.registerTemplate(layoutTmpName);
								var $l = $(layoutTmp());
								this.$cont.html($l);
						}

						this.create();
				}

				private create() {
						this.createCustom();
				}

				protected createCustom() { }

		}

}