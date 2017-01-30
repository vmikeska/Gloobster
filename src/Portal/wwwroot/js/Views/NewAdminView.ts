module Views {

	export class NewAdminView extends ViewBase {

			private currentPage: AdminPageBase;

		constructor() {
			super();			
		}

			private init() {
				this.initTabs();
			}



			private initTabs() {
					var tabs = new Common.Tabs($("#mainTabs"), "main");
					tabs.addTab("wikiTab", "WIKI", () => {
							this.currentPage = new WikiAdminPage();
					});
					tabs.addTab("travelbTab", "Travel buddy");
					tabs.addTab("dashboardTab", "Dashboard");

					tabs.create();
			}
		}


		export class AdminPageBase {
			public $cont;

			constructor(layoutTmpName: string = null) {
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

			protected createCustom() {}

		}
		
		export class WikiAdminPage extends AdminPageBase
		{
				constructor() {
						super("menu-content-tmp");
				}

				createCustom() {
						this.createWikiTabs();
				}

				private createWikiTabs() {
						var tabs = new Common.Tabs(this.$cont.find(".sub-menu"), "subMenu");

						tabs.onBeforeSwitch = () => {
								this.$cont.find(".sub-content").empty();
						}

						tabs.addTab("wikiTasks", "Manage tasks", () => {
								var fnc = new WikiAdminTasks(this.$cont);
								fnc.init();
						});

						tabs.addTab("wikiSections", "Sections management", () => {
								var fnc = new WikiPageSectionsAdmin(this.$cont);
								
								fnc.createSectionsTabs();
								fnc.regCreateNewSection();
						});

						tabs.addTab("wikiNewCity", "Add new city", () => {
								var fnc = new WikiAdminAddCity(this.$cont);
								fnc.init();
						});
						
						tabs.addTab("wikiSuperAdmins", "SuperAdmins management", () => {

						});
						
						tabs.create();
				}
				
		}

		export class WikiAdminTasks {
				private $cont;

				constructor($cont) {
						this.$cont = $cont;
				}

				public init() {

						this.getTasks((tasks) => {
							this.genTasks(tasks);
						});
				}

			private genTasks(tasks) {

				var lg = Common.ListGenerator.init(this.$cont.find(".sub-content"), "task-base-tmp");

				lg.evnt(".action-btn", (e, $item, $target, item) => {

						var name = $target.data("action");
						var id = $item.attr("id");

						var cd = new Common.ConfirmDialog();
						cd.create("Action confirmation", `Do you want to perform action '${name}' ?`, "Cancel", "Execute", () => {

								var data = {
									action: name,
									id: id
								};

								Views.ViewBase.currentView.apiPost("WikiAdminAction",
									data,
									(r) => {
										if (r) {
											$item.remove();
										}
									});

							});

					});

				lg.generateList(tasks);
			}

			private getTasks(callback: Function) {
					Views.ViewBase.currentView.apiGet("WikiAdminAction", [], (tasks) => {
						callback(tasks);
					});						
				}
				
		}

		export class WikiAdminAddCity {
				
				private selectedCity;
				private $cont;

				constructor($cont) {
					this.$cont = $cont;
				}

				public init() {
						var tmp = ViewBase.currentView.registerTemplate("add-city-tmp");
						var $l = $(tmp());
						this.$cont.find(".sub-content").html($l);


						$("#SendCity").click((e) => {
								e.preventDefault();
								this.createCity();
						});

						this.regSearchBox();
				}

				private regSearchBox() {
						var searchBox = new Common.GNOnlineSearchBox("gnCombo");
						searchBox.onSelected = (city) => this.onCitySelected(city);
				}

				private onCitySelected(city) {
						$("#txtGID").val(city.geonameId);
						$("#txtPopulation").val(city.population);
						$("#txtTitle").val(city.name);

						this.selectedCity = city;
				}

				private createCity() {
						if ($("#txtGID").val() === "") {
								return;
						}

						var dialog = new Common.ConfirmDialog();
						dialog.create("Add city", "Do you want to add the city ?", "Cancel", "Create", () => {
								var data = {
										gid: this.selectedCity.geonameId,
										population: $("#txtPopulation").val(),
										title: $("#txtTitle").val(),
										countryCode: this.selectedCity.countryCode
								};

								Views.ViewBase.currentView.apiPost("WikiCity", data, (r) => {

										var id = new Common.InfoDialog();
									if (r) {										
										id.create("The city added", "The city has been added");
									} else {
											id.create("The city not added", "The city has NOT been added");
									}

								});
						});
				}


		}

		export class WikiPageSectionsAdmin {
				private sectionsTab;

				private $cont;

				constructor($cont) {
					this.$cont = $cont;
				}

				public createSectionsTabs() {

						var tmp = ViewBase.currentView.registerTemplate("sections-content-tmp");
						var $l = $(tmp());
						this.$cont.find(".sub-content").html($l);

						this.sectionsTab = new Common.Tabs(this.$cont.find(".sections-menu"), "entitySwitch");

						this.sectionsTab.addTab("entCity", "Cities", () => {

								this.getSectionsMgmt("0", (sections) => {
										this.genSectionsTable(sections);
								});

						});
						this.sectionsTab.addTab("entCountry", "Countries", () => {

								this.getSectionsMgmt("1", (sections) => {
										this.genSectionsTable(sections);
								});

						});

						this.sectionsTab.create();
				}

				public regCreateNewSection() {
						var txtInput = $("#newSectionText");

						$("#newSectionBtn").click((e) => {
								e.preventDefault();

								var txt = txtInput.val();

								if (txt.length > 0) {
										var cd = new Common.ConfirmDialog();
										cd.create("Do you want to create new section", `Do you want to create new section with name '${txt}'?`, "Cancel", "Ok", () => {

												var data = {
														type: (this.sectionsTab.activeTabId === "entCity") ? 0 : 1,
														name: txt
												};

												ViewBase.currentView.apiPost("WikiPageSection", data, (r) => {
														txtInput.val("");

														var t = (this.sectionsTab.activeTabId === "entCity") ? "0" : "1";

														this.getSectionsMgmt(t, (sections) => {
																this.genSectionsTable(sections);
														});
												});
										});
								}

						});
				}

				private genSectionsTable(sections) {

						var lg = Common.ListGenerator.init(this.$cont.find("#sectionsTable"), "section-item-tmp");
						lg.clearCont = true;

						lg.evnt(".del-cross", (e, $item, $target, item) => {

								var pt = (this.sectionsTab.activeTabId === "entCity") ? "0" : "1";
								var st = $item.data("t");

								var data = [["pt", pt], ["st", st]];

								var cd1 = new Common.ConfirmDialog();
								cd1.create("Deletion confirmation", `Do you really want to delete it ?`, "Cancel", "Delete", () => {

										var cd2 = new Common.ConfirmDialog();
										cd2.create("Deletion confirmation", `Do you really want to delete section '${st}'`, "Cancel", "Delete", () => {

												ViewBase.currentView.apiDelete("WikiPageSection", data, (r) => {
														$(`tr[data-t="${st}"]`).remove();
												});

										});

								});

						});

						lg.generateList(sections);

				}

				private getSectionsMgmt(type, callback: Function) {
						var data = [["type", type]];

						ViewBase.currentView.apiGet("WikiPageSection", data, (r) => {
								callback(r);
						});
				}
		}

		

}